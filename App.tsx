import React, { useState, useEffect, useRef } from 'react';
import { TodoItem, AnswerState, FilterState, Group, HeaderData } from './types';
import Header from './components/Header';
import ChecklistHeader from './components/ChecklistHeader';
import InputForm from './components/InputForm';
import ChecklistItem from './components/ChecklistItem';
import FooterActions from './components/FooterActions';
import FilterControls from './components/FilterControls';
import AddGroupForm from './components/AddGroupForm';
import TrashIcon from './components/icons/TrashIcon';
import { useLanguage } from './contexts/LanguageContext';
import ActionsDropdown from './components/ActionsDropdown';


// Let TypeScript know that XLSX is available on the window object from the CDN script
declare const XLSX: any;

const App: React.FC = () => {
  const { t } = useLanguage();

  const getDefaultHeaderData = (): HeaderData => ({
    title: t('listTitle'),
    investor: '',
    contractor: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [headerData, setHeaderData] = useState<HeaderData>(() => {
    try {
      const savedData = localStorage.getItem('headerData');
      return savedData ? JSON.parse(savedData) : getDefaultHeaderData();
    } catch (error) {
      console.error("Could not parse header data from localStorage", error);
      return getDefaultHeaderData();
    }
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const savedGroups = localStorage.getItem('groups');
      return savedGroups ? JSON.parse(savedGroups) : [];
    } catch (error) {
      console.error("Could not parse groups from localStorage", error);
      return [];
    }
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        // Migration for old data structures
        return parsedTodos.map((todo: any) => {
          let answer: AnswerState = 'unanswered';
          if (typeof todo.completed === 'boolean') {
            answer = todo.completed ? 'yes' : 'unanswered';
          } else if (todo.answer) {
            answer = todo.answer;
          }
          return {
            id: todo.id,
            text: todo.text,
            answer: answer,
            groupId: todo.groupId ?? null,
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Could not parse todos from localStorage", error);
      return [];
    }
  });

  const [filter, setFilter] = useState<FilterState>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(Date.now());


  const getNewId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };
  
  // Set default title based on language if it hasn't been changed from the default
  useEffect(() => {
    const savedData = localStorage.getItem('headerData');
    if (!savedData) {
      setHeaderData(prev => ({ ...prev, title: t('listTitle') }));
    }
  }, [t]);

  useEffect(() => {
    try {
      localStorage.setItem('headerData', JSON.stringify(headerData));
    } catch (error) {
      console.error("Could not save header data to localStorage", error);
    }
  }, [headerData]);

  useEffect(() => {
    try {
      localStorage.setItem('groups', JSON.stringify(groups));
    } catch (error) {
      console.error("Could not save groups to localStorage", error);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Could not save todos to localStorage", error);
    }
  }, [todos]);

  const handleHeaderChange = (field: keyof HeaderData, value: string) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (text: string, groupId: number | null) => {
    const newItem: TodoItem = {
      id: getNewId(),
      text,
      answer: 'unanswered',
      groupId,
    };
    setTodos(prevTodos => [...prevTodos, newItem]);
  };
  
  const handleImportItems = (newItems: TodoItem[]) => {
    const existingTexts = new Set(todos.map(t => t.text));
    const uniqueNewItems = newItems.filter(item => !existingTexts.has(item.text));

    if(uniqueNewItems.length > 0) {
      setTodos(prevTodos => [...prevTodos, ...uniqueNewItems]);
    }
    
    if (uniqueNewItems.length < newItems.length) {
      alert(t('importSomeExist'));
    }
  };
  
  const handleAddGroup = (name: string) => {
    if (name.trim() === '') return;
    const newGroup: Group = {
      id: getNewId(),
      name: name.trim(),
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const handleDeleteGroup = (id: number) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setTodos(prev => prev.map(t => t.groupId === id ? { ...t, groupId: null } : t));
  };


  const handleSetAnswer = (id: number, answer: AnswerState) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, answer } : todo
      )
    );
  };

  const handleDeleteItem = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleEditItem = (id: number, newText: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const handleMoveItem = (id: number, groupId: number | null) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, groupId } : todo
      )
    );
  };

  const handleClearAnswered = () => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.answer === 'unanswered'));
  };

  const handleResetAnswers = () => {
    setTodos(prevTodos => 
        prevTodos.map(todo => ({ ...todo, answer: 'unanswered' }))
    );
  };

  const handleClearAll = () => {
    setTodos([]);
    setGroups([]);
    setHeaderData(getDefaultHeaderData());
  };

  const handleExport = () => {
    if (todos.length === 0) {
      alert(t('noTasksToExport'));
      return;
    }

    const headerRows = [
      [t('title'), headerData.title],
      [t('investorHeader'), headerData.investor],
      [t('contractorHeader'), headerData.contractor],
      [t('dateHeader'), headerData.date],
      [], // Spacer row
      [t('task'), t('answer'), t('group')]
    ];

    const dataToExport = todos.map(todo => {
        const group = groups.find(g => g.id === todo.groupId);
        return [ 
            todo.text, 
            t(todo.answer),
            group ? group.name : t('uncategorized')
        ];
    });

    const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataToExport]);
    
    const colWidths = [
      { wch: 60 },
      { wch: 15 },
      { wch: 20 },
    ];
    ws['!cols'] = colWidths;


    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Checklist");
    XLSX.writeFile(wb, "checklist.xlsx");
  };

  const handleExportPdf = () => {
    if (todos.length === 0) {
      alert(t('noTasksToExport'));
      return;
    }
  
    const { jsPDF } = (window as any).jspdf;
    if (!jsPDF) {
      console.error("jsPDF library not found.");
      alert(t('pdfErrorLib'));
      return;
    }
    const doc = new jsPDF();
    
    if (typeof (doc as any).autoTable !== 'function') {
        console.error("jspdf-autotable plugin not found.");
        alert(t('pdfErrorPlugin'));
        return;
    }
  
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(headerData.title, 15, 20);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
  
    const headerLeft = `${t('investorHeader')} ${headerData.investor}\n${t('contractorHeader')} ${headerData.contractor}`;
    const headerRight = `${t('dateHeader')} ${headerData.date}`;
    doc.text(headerLeft, 15, 30);
    doc.text(headerRight, doc.internal.pageSize.getWidth() - 15, 30, { align: 'right' });
  
    let startY = 45;
  
    const drawTable = (title: string, tableTodos: TodoItem[], isGrouped: boolean) => {
        if (startY > 265) { 
            doc.addPage();
            startY = 20;
        }
  
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40);
        doc.text(title, 15, startY);
        startY += 2;
        
        const tableBody = tableTodos.map(todo => [todo.text, t(todo.answer)]);
        
        (doc as any).autoTable({
            startY: startY,
            head: [[t('task'), t('answer')]],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: isGrouped ? '#16a085' : '#34495e' },
            styles: { font: 'helvetica', fontSize: 10 },
            columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 30 } },
            didDrawCell: (data: any) => {
              if (data.column.index === 1 && data.section === 'body') {
                const answer = data.cell.text[0].toLowerCase();
                const originalAnswer = todos.find(todo => t(todo.answer).toLowerCase() === answer)?.answer;

                let fillColor;
                
                switch (originalAnswer) {
                  case 'yes':
                    fillColor = '#28a745';
                    break;
                  case 'no':
                    fillColor = '#dc3545';
                    break;
                  case 'na':
                    fillColor = '#6c757d';
                    break;
                  default:
                    return;
                }
    
                if (fillColor) {
                  doc.setFillColor(fillColor);
                  doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                  doc.setTextColor('#ffffff');
                  const text = data.cell.text;
                  const textWidth = doc.getTextWidth(text[0]);
                  const textX = data.cell.x + (data.cell.width - textWidth) / 2;
                  const textY = data.cell.y + data.cell.height / 2;
                  doc.text(text, textX, textY, { baseline: 'middle' });
                }
              }
            }
        });
        
        startY = (doc as any).lastAutoTable.finalY + 15;
    }
  
    const ungrouped = todos.filter(t => t.groupId === null);
    if (ungrouped.length > 0) {
        drawTable(t('uncategorized'), ungrouped, false);
    }
  
    groups.forEach(group => {
        const todosInGroup = todos.filter(t => t.groupId === group.id);
        if (todosInGroup.length > 0) {
            drawTable(group.name, todosInGroup, true);
        }
    });
  
    const safeFilename = (headerData.title || 'checklist').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeFilename}.pdf`);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { [t('task')]: "Pay electricity bill", [t('group')]: "Finances" }, 
      { [t('task')]: "Buy groceries", [t('group')]: "Home" }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "checklist_template.xlsx");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });

        if (rows.length === 0) {
          alert(t('importEmptyFile'));
          return;
        }

        const taskHeaderStr = t('task').toLowerCase();
        const groupHeaderStr = t('group').toLowerCase();
        
        let dataStartIndex = 0;
        let taskColIndex = -1;
        let groupColIndex = -1;
        let headerRowFound = false;
        
        // Find the header row and column indices by checking for the 'task' header
        for(let i = 0; i < Math.min(rows.length, 10); i++) {
            const row = rows[i].map(cell => String(cell || '').toLowerCase().trim());
            const currentTaskIndex = row.indexOf(taskHeaderStr);
            if (currentTaskIndex !== -1) {
                headerRowFound = true;
                dataStartIndex = i + 1;
                taskColIndex = currentTaskIndex;
                groupColIndex = row.indexOf(groupHeaderStr);
                
                // If header is not on the first row, assume it's an export file and parse metadata
                if (i > 0) {
                    const metadataRows = rows.slice(0, i);
                    const titleRow = metadataRows.find(r => String(r[0] || '').trim() === t('title'));
                    if (titleRow && titleRow[1]) handleHeaderChange('title', String(titleRow[1]));
                    
                    const investorRow = metadataRows.find(r => String(r[0] || '').trim() === t('investorHeader'));
                    if (investorRow && investorRow[1]) handleHeaderChange('investor', String(investorRow[1]));

                    const contractorRow = metadataRows.find(r => String(r[0] || '').trim() === t('contractorHeader'));
                    if (contractorRow && contractorRow[1]) handleHeaderChange('contractor', String(contractorRow[1]));

                    const dateRow = metadataRows.find(r => String(r[0] || '').trim() === t('dateHeader'));
                    if (dateRow && dateRow[1]) handleHeaderChange('date', String(dateRow[1]));
                }
                break;
            }
        }

        // If no header row is found, assume it's a simple list with no headers
        if (!headerRowFound) {
            dataStartIndex = 0;
            taskColIndex = 0; // Assume tasks are in the first column
        }

        const dataRows = rows.slice(dataStartIndex);
        
        if (dataRows.length === 0 && headerRowFound) {
            alert(t('importNoNewTasks'));
            return;
        }

        const newItems: TodoItem[] = [];
        const newGroups: Group[] = [];
        const groupMap = new Map<string, Group>();
        groups.forEach(g => groupMap.set(g.name.toLowerCase(), g));

        dataRows.forEach((row) => {
            if (row.length <= taskColIndex) return;
            const text = String(row[taskColIndex] || '').trim();
            if (!text) return;

            let groupId: number | null = null;
            if (groupColIndex !== -1 && row.length > groupColIndex) {
                const groupName = String(row[groupColIndex] || '').trim();
                if (groupName) {
                    const lowerCaseGroupName = groupName.toLowerCase();
                    if (groupMap.has(lowerCaseGroupName)) {
                        groupId = groupMap.get(lowerCaseGroupName)!.id;
                    } else if (lowerCaseGroupName !== t('uncategorized').toLowerCase()) {
                        const newGroup: Group = { id: getNewId(), name: groupName };
                        newGroups.push(newGroup);
                        groupMap.set(lowerCaseGroupName, newGroup);
                        groupId = newGroup.id;
                    }
                }
            }

            newItems.push({
                id: getNewId(),
                text,
                answer: 'unanswered',
                groupId,
            });
        });

        if (newGroups.length > 0) {
          setGroups(prev => [...prev, ...newGroups]);
        }
  
        if (newItems.length > 0) {
          handleImportItems(newItems);
        } else {
          alert(t('importNoNewTasks'));
        }

      } catch (error) {
        console.error("Error importing file:", error);
        alert(t('importError'));
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert(t('fileReadError'));
    };
    reader.readAsArrayBuffer(file);
      
    if(e.target) e.target.value = '';
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    }
    return todo.answer === filter;
  });
  
  const ungroupedTodos = filteredTodos.filter(t => t.groupId === null);

  const answeredCount = todos.filter(t => t.answer !== 'unanswered').length;
  const totalCount = todos.length;
  const hasAnyItems = todos.length > 0 || groups.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <Header />
          <ChecklistHeader data={headerData} onUpdate={handleHeaderChange} />
          <InputForm onAddItem={handleAddItem} groups={groups} />

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <AddGroupForm onAddGroup={handleAddGroup} />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept=".xlsx, .xls, .csv"
            />
            
            <ActionsDropdown
              onDownloadTemplate={handleDownloadTemplate}
              onImportClick={handleImportClick}
              onExportExcel={handleExport}
              onExportPdf={handleExportPdf}
              isExportDisabled={todos.length === 0}
            />
          </div>


          <div className="mt-6">
            {todos.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{t('yourTasks')}</span>
                  <span>{answeredCount} / {totalCount} {t('answered')}</span>
                </div>
                <FilterControls currentFilter={filter} onSetFilter={setFilter} />
              </>
            )}
            
            <div className="space-y-6 mt-4">
              {/* Ungrouped items */}
              {(ungroupedTodos.length > 0 || (groups.length === 0 && todos.length > 0 && filteredTodos.length > 0)) && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('uncategorized')}</h2>
                    <ul className="space-y-3">
                      {ungroupedTodos.map(todo => (
                        <ChecklistItem
                          key={todo.id}
                          todo={todo}
                          groups={groups}
                          onSetAnswer={handleSetAnswer}
                          onDeleteItem={handleDeleteItem}
                          onEditItem={handleEditItem}
                          onMoveItem={handleMoveItem}
                        />
                      ))}
                    </ul>
                </div>
              )}
              
              {/* Grouped items */}
              {groups.map(group => {
                  const todosInGroup = filteredTodos.filter(t => t.groupId === group.id);
                  if (todosInGroup.length === 0 && filter !== 'all') {
                    return null;
                  }

                  return (
                    <div key={group.id}>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">{group.name}</h2>
                            <button onClick={() => handleDeleteGroup(group.id)} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors" aria-label={t('deleteGroupAria', { groupName: group.name })}>
                                <TrashIcon />
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {todosInGroup.map(todo => <ChecklistItem key={todo.id} todo={todo} groups={groups} onSetAnswer={handleSetAnswer} onDeleteItem={handleDeleteItem} onEditItem={handleEditItem} onMoveItem={handleMoveItem} />)}
                        </ul>
                        {todosInGroup.length === 0 && (
                          <p className="text-gray-400 dark:text-gray-500 text-sm pl-4 italic">{t('groupIsEmpty')}</p>
                        )}
                    </div>
                  )
              })}
            </div>

            {todos.length > 0 && filteredTodos.length === 0 && (
                 <div className="text-center py-10 px-4">
                    <p className="text-gray-400 dark:text-gray-500">{t('noTasksMatchFilter')}</p>
                 </div>
            )}

            {todos.length === 0 && (
                 <div className="text-center py-10 px-4">
                    <p className="text-gray-400 dark:text-gray-500">{t('checklistIsEmpty')}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t('getStarted')}</p>
                 </div>
            )}
          </div>

          {hasAnyItems && (
            <FooterActions
              onClearAnswered={handleClearAnswered}
              onResetAnswers={handleResetAnswers}
              onClearAll={handleClearAll}
              hasAnsweredItems={answeredCount > 0}
              hasAnyItems={hasAnyItems}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
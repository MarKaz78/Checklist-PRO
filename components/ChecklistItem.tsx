import React, { useState, useRef, useEffect } from 'react';
import { TodoItem, AnswerState, Group } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import SaveIcon from './icons/SaveIcon';
import CheckIcon from './icons/CheckIcon';
import CrossIcon from './icons/CrossIcon';
import DashIcon from './icons/DashIcon';
import { useLanguage } from '../contexts/LanguageContext';


interface ChecklistItemProps {
  todo: TodoItem;
  groups: Group[];
  onSetAnswer: (id: number, answer: AnswerState) => void;
  onDeleteItem: (id: number) => void;
  onEditItem: (id: number, newText: string) => void;
  onMoveItem: (id: number, groupId: number | null) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ todo, groups, onSetAnswer, onDeleteItem, onEditItem, onMoveItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onEditItem(todo.id, editText.trim());
      setIsEditing(false);
    } else {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleStatusClick = () => {
    if (isEditing) return;
    const statusCycle: AnswerState[] = ['unanswered', 'yes', 'no', 'na'];
    const currentIndex = statusCycle.indexOf(todo.answer);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    onSetAnswer(todo.id, statusCycle[nextIndex]);
  };
  
  const getStatusContent = () => {
    switch (todo.answer) {
        case 'yes':
            return <CheckIcon />;
        case 'no':
            return <CrossIcon />;
        case 'na':
            return <DashIcon />;
        default:
            return null;
    }
  };

  const statusBaseClasses = "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 flex-shrink-0";
  const statusColorClasses = {
      unanswered: "border-gray-400 hover:border-gray-500 dark:border-gray-500 dark:hover:border-gray-400",
      yes: "bg-green-500 border-green-500 ring-green-400 text-white",
      no: "bg-red-500 border-red-500 ring-red-400 text-white",
      na: "bg-gray-500 border-gray-500 ring-gray-400 text-white",
  };

  return (
    <li className="flex items-center bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 group gap-4">
      <button
        onClick={handleStatusClick}
        disabled={isEditing}
        aria-label={t('changeStatusAria', { taskText: todo.text, status: todo.answer })}
        className={`${statusBaseClasses} ${statusColorClasses[todo.answer]}`}
      >
        {getStatusContent()}
      </button>

      {isEditing ? (
        <div className="flex-grow flex items-center gap-2">
            <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="flex-grow bg-gray-200 dark:bg-gray-900/50 -my-1 -mx-2 px-2 py-1 rounded text-gray-800 dark:text-gray-200 focus:outline-none"
            />
            <button onClick={handleSave} className="text-green-400 hover:text-green-300" aria-label={t('saveTaskAria')}>
                <SaveIcon />
            </button>
        </div>
      ) : (
        <>
          <span className="flex-grow text-gray-800 dark:text-gray-200">{todo.text}</span>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {groups.length > 0 && (
                <select
                  value={todo.groupId === null ? 'null' : todo.groupId.toString()}
                  onChange={(e) => {
                    const newGroupId = e.target.value === 'null' ? null : parseInt(e.target.value, 10);
                    onMoveItem(todo.id, newGroupId);
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent li click handlers
                  className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded border border-gray-400 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 py-0.5"
                  aria-label={t('moveTaskAria', { taskText: todo.text })}
                >
                  <option value="null">{t('uncategorized')}</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id.toString()}>
                      {group.name}
                    </option>
                  ))}
                </select>
            )}
            <button onClick={() => setIsEditing(true)} className="text-yellow-400 hover:text-yellow-300" aria-label={t('editTaskAria')}>
              <EditIcon />
            </button>
            <button onClick={() => onDeleteItem(todo.id)} className="text-red-500 hover:text-red-400" aria-label={t('deleteTaskAria')}>
              <TrashIcon />
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default ChecklistItem;
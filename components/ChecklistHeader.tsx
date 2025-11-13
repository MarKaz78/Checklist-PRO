import React, { useState, useEffect, useRef } from 'react';
import { HeaderData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChecklistHeaderProps {
  data: HeaderData;
  onUpdate: (field: keyof HeaderData, value: string) => void;
}

interface EditableFieldProps {
  label: string;
  value: string;
  fieldKey: keyof HeaderData;
  onSave: (field: keyof HeaderData, value: string) => void;
  inputType?: 'text' | 'date';
  isTitle?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, fieldKey, onSave, inputType = 'text', isTitle = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (currentValue.trim() !== value.trim()) {
        onSave(fieldKey, currentValue);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
    } else if (e.key === 'Escape') {
        setCurrentValue(value);
        setIsEditing(false);
    }
  };

  const commonInputClasses = "w-full bg-gray-200 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const titleInputClasses = "text-2xl font-bold text-center";
  const regularInputClasses = "text-sm";
  
  const commonDisplayClasses = "cursor-pointer rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors truncate";
  const titleDisplayClasses = "text-2xl font-bold text-gray-900 dark:text-gray-100";
  const regularDisplayClasses = "text-gray-800 dark:text-gray-200";

  return (
    <div className={isTitle ? "" : "flex-1 min-w-[calc(50%-0.5rem)]"}>
      {!isTitle && <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>}
      {isEditing ? (
        <input
          ref={inputRef}
          type={inputType}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${commonInputClasses} ${isTitle ? titleInputClasses : regularInputClasses}`}
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className={`${commonDisplayClasses} ${isTitle ? titleDisplayClasses : regularDisplayClasses}`}
          title={value}
        >
          {value || <span className="italic text-gray-400 dark:text-gray-500">{t('clickToEdit')}</span>}
        </p>
      )}
    </div>
  );
};


const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ data, onUpdate }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div 
        className="text-center mb-4"
      >
        <EditableField label="" value={data.title} fieldKey="title" onSave={onUpdate} isTitle />
      </div>
      <div className="flex flex-wrap gap-4 justify-between">
        <EditableField label={t('investor')} value={data.investor} fieldKey="investor" onSave={onUpdate} />
        <EditableField label={t('contractor')} value={data.contractor} fieldKey="contractor" onSave={onUpdate} />
        <EditableField label={t('date')} value={data.date} fieldKey="date" onSave={onUpdate} inputType="date" />
      </div>
    </div>
  );
};

export default ChecklistHeader;
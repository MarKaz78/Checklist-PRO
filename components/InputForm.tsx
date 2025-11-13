import React, { useState } from 'react';
import { Group } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InputFormProps {
  onAddItem: (text: string, groupId: number | null) => void;
  groups: Group[];
}

const InputForm: React.FC<InputFormProps> = ({ onAddItem, groups }) => {
  const [text, setText] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('null');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const groupId = selectedGroupId === 'null' ? null : parseInt(selectedGroupId, 10);
      onAddItem(text.trim(), groupId);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('addTaskPlaceholder')}
        className="flex-grow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
      />
      <div className="flex gap-3">
        {groups.length > 0 && (
            <select
            value={selectedGroupId}
            onChange={e => setSelectedGroupId(e.target.value)}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            >
            <option value="null">{t('uncategorized')}</option>
            {groups.map(group => (
                <option key={group.id} value={group.id.toString()}>
                {group.name}
                </option>
            ))}
            </select>
        )}
        <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-grow sm:flex-grow-0"
            disabled={!text.trim()}
        >
            {t('add')}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
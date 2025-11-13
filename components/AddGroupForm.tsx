import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AddGroupFormProps {
  onAddGroup: (name: string) => void;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onAddGroup }) => {
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGroup(name.trim());
      setName('');
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors duration-300"
      >
        {t('newGroup')}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} onBlur={() => { if (!name.trim()) setIsEditing(false) }} className="flex gap-2 w-full sm:w-auto">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('newGroupNamePlaceholder')}
        className="flex-grow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        autoFocus
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white font-semibold px-4 py-1 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50"
        disabled={!name.trim()}
      >
        {t('create')}
      </button>
    </form>
  );
};

export default AddGroupForm;
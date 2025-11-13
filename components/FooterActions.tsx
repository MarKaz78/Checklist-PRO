import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterActionsProps {
  onClearAnswered: () => void;
  onResetAnswers: () => void;
  onClearAll: () => void;
  hasAnsweredItems: boolean;
  hasAnyItems: boolean;
}

const FooterActions: React.FC<FooterActionsProps> = ({ onClearAnswered, onResetAnswers, onClearAll, hasAnsweredItems, hasAnyItems }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
       <button
          onClick={onClearAll}
          disabled={!hasAnyItems}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-red-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto sm:order-1"
        >
          {t('clearAll')}
        </button>
      <div className="flex flex-wrap justify-end gap-3 w-full sm:w-auto sm:order-2">
        <button
          onClick={onResetAnswers}
          disabled={!hasAnsweredItems}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('resetAnswers')}
        </button>
        <button
          onClick={onClearAnswered}
          disabled={!hasAnsweredItems}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('clearAnswered')}
        </button>
      </div>
    </div>
  );
};

export default FooterActions;
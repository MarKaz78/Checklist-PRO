import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import DownloadIcon from './icons/DownloadIcon';
import ImportIcon from './icons/ImportIcon';
import ExportIcon from './icons/ExportIcon';
import PdfIcon from './icons/PdfIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface ActionsDropdownProps {
  onDownloadTemplate: () => void;
  onImportClick: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  isExportDisabled: boolean;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  onDownloadTemplate,
  onImportClick,
  onExportExcel,
  onExportPdf,
  isExportDisabled,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleActionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {t('actions')}
          <ChevronDownIcon />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => handleActionClick(onDownloadTemplate)}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <DownloadIcon /> {t('template')}
            </button>
            <button
              onClick={() => handleActionClick(onImportClick)}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <ImportIcon /> {t('import')}
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            <button
              onClick={() => !isExportDisabled && handleActionClick(onExportExcel)}
              disabled={isExportDisabled}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              <ExportIcon /> {t('exportExcel')}
            </button>
            <button
              onClick={() => !isExportDisabled && handleActionClick(onExportPdf)}
              disabled={isExportDisabled}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              <PdfIcon /> {t('exportPdf')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;

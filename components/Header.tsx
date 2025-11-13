import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const buttonBaseClasses = "px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200";
  const activeClasses = "bg-indigo-600 text-white";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";
  
  return (
    <header className="text-center mb-8 relative">
       <div className="absolute top-0 right-0 flex items-center gap-2">
        <ThemeSwitcher />
        <button 
          onClick={() => setLanguage('en')}
          className={`${buttonBaseClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage('pl')}
          className={`${buttonBaseClasses} ${language === 'pl' ? activeClasses : inactiveClasses}`}
        >
          PL
        </button>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 pt-10 sm:pt-0">
        {t('appTitle')}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{t('appSubtitle')}</p>
    </header>
  );
};

export default Header;
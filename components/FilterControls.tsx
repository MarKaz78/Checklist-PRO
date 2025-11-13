import React from 'react';
import { FilterState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FilterControlsProps {
  currentFilter: FilterState;
  onSetFilter: (filter: FilterState) => void;
}

const FilterButton: React.FC<{
    text: string;
    filterValue: FilterState;
    currentFilter: FilterState;
    onSetFilter: (filter: FilterState) => void;
}> = ({ text, filterValue, currentFilter, onSetFilter }) => {
    const isActive = currentFilter === filterValue;
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500";
    const activeClasses = "bg-indigo-600 text-white";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";

    return (
        <button onClick={() => onSetFilter(filterValue)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {text}
        </button>
    );
};


const FilterControls: React.FC<FilterControlsProps> = ({ currentFilter, onSetFilter }) => {
  const { t } = useLanguage();

  const filters: { text: string; value: FilterState }[] = [
    { text: t('all'), value: 'all' },
    { text: t('yes'), value: 'yes' },
    { text: t('no'), value: 'no' },
    { text: t('na'), value: 'na' },
    { text: t('unanswered'), value: 'unanswered' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
      {filters.map(filter => (
          <FilterButton 
            key={filter.value}
            text={filter.text}
            filterValue={filter.value}
            currentFilter={currentFilter}
            onSetFilter={onSetFilter}
          />
      ))}
    </div>
  );
};

export default FilterControls;
import React, { useState, useRef, useEffect } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { CalendarPicker } from './CalendarPicker';

interface FilterDropdownProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  type: 'period' | 'marketplace' | 'country' | 'category' | 'gender';
  options?: string[];
  onValueChange?: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  value, 
  icon, 
  type,
  options = [],
  onValueChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setSelectedPeriod } = useFilters();

  // Synchroniser la valeur avec la prop value (pour la période depuis le contexte)
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const renderDropdownContent = () => {
    if (type === 'period') {
      return <CalendarPicker onSelect={handleSelect} setSelectedPeriod={setSelectedPeriod} />;
    } else {
      return (
        <div className="py-2">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option || 'all'}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-2 hover:bg-[#E7EAF0] transition-colors font-['Lato'] text-[16px] text-[#1D1D1D]"
              >
                {option || 'Tous'}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-[#7A778E] font-['Lato'] text-[14px]">
              Aucune option disponible
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="w-[340px] h-[70px] bg-[#E7EAF0] rounded-[11px] relative cursor-pointer hover:bg-[#D9DCE5] transition-colors flex items-center px-3"
        aria-label={label}
        aria-expanded={isOpen}
      >
        <div className="w-[50px] h-[50px] bg-[#19182D] rounded-[10px] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 flex flex-col justify-center ml-4 min-w-0">
          <p className="font-['Lato'] font-medium text-[18px] leading-[22px] text-[#1D1D1D] truncate">
            {label}
          </p>
          <p className={`font-['Lato'] font-medium text-[14px] leading-[18px] truncate ${selectedValue ? 'text-[#7A778E]' : 'text-[#B0B0B0] italic'}`}>
            {selectedValue || 'Sélectionner...'}
          </p>
        </div>
        <div className={`w-[40px] h-[38px] flex items-center justify-center transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-[24px] h-[14px] text-[#7A7795]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 10L12 15L17 10H7Z" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={`absolute top-[75px] left-0 w-[340px] bg-white rounded-[10px] shadow-lg border border-[#E7EAF0] z-50 ${type === 'period' ? 'max-h-[500px]' : 'max-h-[400px]'} overflow-y-auto`}>
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
};


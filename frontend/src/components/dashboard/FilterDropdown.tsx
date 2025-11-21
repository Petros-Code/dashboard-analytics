import React, { useState, useRef, useEffect } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { CalendarPicker } from './CalendarPicker';

interface FilterDropdownProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  left: number;
  type: 'period' | 'marketplace' | 'country';
  options?: string[];
  onValueChange?: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  value, 
  icon, 
  left, 
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
                key={option}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-2 hover:bg-[#E7EAF0] transition-colors font-['Lato'] text-[16px] text-[#1D1D1D]"
              >
                {option}
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
    <div className="absolute" style={{ left: `${left}px` }} ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="w-[340px] h-[70px] bg-[#E7EAF0] rounded-[11px] relative cursor-pointer hover:bg-[#D9DCE5] transition-colors"
        aria-label={label}
        aria-expanded={isOpen}
      >
        <div className="absolute left-[12px] top-[10px] w-[50px] h-[50px] bg-[#19182D] rounded-[10px] flex items-center justify-center">
          {icon}
        </div>
        <p className="absolute left-[76px] top-[10px] w-[200px] h-[15px] font-['Lato'] font-medium text-[20px] leading-[40px] text-[#1D1D1D] flex items-center">
          {label}
        </p>
        <p className={`absolute left-[76px] top-[42px] w-[200px] h-[15px] font-['Lato'] font-medium text-[16px] leading-[40px] flex items-center ${selectedValue ? 'text-[#7A778E]' : 'text-[#B0B0B0] italic'}`}>
          {selectedValue || 'Sélectionner...'}
        </p>
        <div className={`absolute left-[292px] top-[16px] w-[40px] h-[38px] flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
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


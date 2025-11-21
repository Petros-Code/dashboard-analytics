import React, { useState } from 'react';
import { formatDateForAPI, formatDateForDisplay, FRENCH_MONTHS, FRENCH_DAYS } from '../../utils/dateUtils';

interface CalendarPickerProps {
  onSelect: (value: string) => void;
  setSelectedPeriod: (period: { startDate: string | null; endDate: string | null } | null) => void;
}

/**
 * Composant Calendrier pour la sélection de période
 */
export const CalendarPicker: React.FC<CalendarPickerProps> = ({ onSelect, setSelectedPeriod }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedStartDate && selectedEndDate) {
      const formatted = `${formatDateForDisplay(selectedStartDate, FRENCH_MONTHS)} - ${formatDateForDisplay(selectedEndDate, FRENCH_MONTHS)}`;
      onSelect(formatted);
      
      // Mettre à jour le contexte avec les dates au format API
      setSelectedPeriod({
        startDate: formatDateForAPI(selectedStartDate),
        endDate: formatDateForAPI(selectedEndDate),
      });
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="p-3 pb-4">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-[#E7EAF0] rounded"
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <h3 className="font-['Lato'] font-medium text-[16px] text-[#1D1D1D]">
          {FRENCH_MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-[#E7EAF0] rounded"
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {FRENCH_DAYS.map((day) => (
          <div key={day} className="text-center text-[12px] font-['Lato'] font-medium text-[#7A7795] py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {Array.from({ length: startingDayOfWeek }, (_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = selectedStartDate && date.getTime() === selectedStartDate.getTime();
          const isInRange = selectedStartDate && selectedEndDate && 
            date >= selectedStartDate && date <= selectedEndDate;
          const isEndSelected = selectedEndDate && date.getTime() === selectedEndDate.getTime();

          let buttonClass = 'aspect-square rounded text-[14px] font-[\'Lato\'] transition-colors ';
          if (isSelected || isEndSelected) {
            buttonClass += 'bg-[#19182D] text-white';
          } else if (isInRange) {
            buttonClass += 'bg-[#E7EAF0] text-[#1D1D1D]';
          } else {
            buttonClass += 'hover:bg-[#E7EAF0] text-[#1D1D1D]';
          }

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={buttonClass}
              aria-label={`Sélectionner le ${day}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedStartDate && selectedEndDate && (
        <button
          onClick={handleConfirm}
          className="w-full mt-2 py-2 bg-[#19182D] text-white rounded-[8px] font-['Lato'] font-medium text-[14px] hover:bg-[#2A2840] transition-colors"
        >
          Confirmer
        </button>
      )}
    </div>
  );
};


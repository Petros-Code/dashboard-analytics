import React from 'react';

interface AgingProductsButtonsProps {
  selectedDays: number | null;
  onDaysChange: (days: number | null) => void;
}

export const AgingProductsButtons: React.FC<AgingProductsButtonsProps> = ({ 
  selectedDays, 
  onDaysChange 
}) => {
  const daysOptions = [30, 60, 90, 120];

  return (
    <div className="grid grid-cols-2 gap-2">
      {daysOptions.map((days) => (
        <button
          key={days}
          onClick={() => onDaysChange(selectedDays === days ? null : days)}
          className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-medium text-sm transition-colors duration-200 ${
            selectedDays === days
              ? 'bg-[#1D1D1D] text-white'
              : 'bg-white border-2 border-[#1D1D1D] text-[#1D1D1D] hover:bg-[#E7EAF0]'
          }`}
          aria-label={`Afficher produits vieux de ${days} jours`}
        >
          {days}
        </button>
      ))}
    </div>
  );
};


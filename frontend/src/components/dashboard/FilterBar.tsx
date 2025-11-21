import React, { useState } from 'react';
import { FilterDropdown } from './FilterDropdown';
import { FILTERS, FILTER_POSITIONS } from '../../constants/dashboard';

interface FilterBarProps {
  userName: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ userName }) => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    period: '17 Sep 2025 - 26 Nov 2025',
    marketplace: '',
    country: '',
  });

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  // Options pour les listes déroulantes (à remplir plus tard)
  const marketplaceOptions: string[] = []; // À ajouter plus tard
  const countryOptions: string[] = []; // À ajouter plus tard

  return (
    <div className="absolute left-0 top-[100px] w-[2200px] h-[100px] bg-white rounded-[10px] shadow-sm">
      <h2 className="absolute left-[17px] top-[20px] w-[500px] h-[60px] font-['Lato'] font-medium text-[20px] leading-[28px] text-[#1D1D1D] flex flex-col justify-center">
        <span>Bonjour {userName},</span>
        <span>bienvenue sur le Dashboard</span>
      </h2>

      <div className="absolute right-[17px] top-[15px] w-[1107px] h-[70px]">
        {FILTERS.map((filter, index) => {
          let options: string[] | undefined;
          if (filter.id === 'marketplace') {
            options = marketplaceOptions;
          } else if (filter.id === 'country') {
            options = countryOptions;
          }

          return (
            <FilterDropdown
              key={filter.id}
              label={filter.label}
              value={filterValues[filter.id] || filter.value}
              icon={filter.icon}
              left={FILTER_POSITIONS[index].left}
              type={filter.id as 'period' | 'marketplace' | 'country'}
              options={options}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            />
          );
        })}
      </div>
    </div>
  );
};


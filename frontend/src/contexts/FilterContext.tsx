import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { calculateDaysBetween } from '../utils/dateUtils';

interface FilterContextType {
  selectedPeriod: { startDate: string | null; endDate: string | null } | null;
  setSelectedPeriod: (period: { startDate: string | null; endDate: string | null } | null) => void;
  getDaysCount: () => number;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<{ startDate: string | null; endDate: string | null } | null>(null);

  const getDaysCount = React.useCallback((): number => {
    if (!selectedPeriod || !selectedPeriod.startDate || !selectedPeriod.endDate) {
      return 0;
    }
    return calculateDaysBetween(selectedPeriod.startDate, selectedPeriod.endDate);
  }, [selectedPeriod]);

  const contextValue = useMemo(() => ({
    selectedPeriod,
    setSelectedPeriod,
    getDaysCount,
  }), [selectedPeriod, getDaysCount]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};


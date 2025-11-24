import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { calculateDaysBetween } from '../utils/dateUtils';

interface FilterContextType {
  selectedPeriod: { startDate: string | null; endDate: string | null } | null;
  setSelectedPeriod: (period: { startDate: string | null; endDate: string | null } | null) => void;
  selectedMarketplace: number | null;
  setSelectedMarketplace: (marketplaceId: number | null) => void;
  selectedCountry: number | null;
  setSelectedCountry: (countryId: number | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedGender: string | null;
  setSelectedGender: (gender: string | null) => void;
  getDaysCount: () => number;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialiser avec une période par défaut qui couvre toute l'année 2025
  const getDefaultPeriod = () => {
    // Période par défaut : toute l'année 2025
    return {
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    };
  };

  const [selectedPeriod, setSelectedPeriod] = useState<{ startDate: string | null; endDate: string | null } | null>(getDefaultPeriod());
  const [selectedMarketplace, setSelectedMarketplace] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const getDaysCount = React.useCallback((): number => {
    if (!selectedPeriod?.startDate || !selectedPeriod?.endDate) {
      return 0;
    }
    return calculateDaysBetween(selectedPeriod.startDate, selectedPeriod.endDate);
  }, [selectedPeriod]);

  const contextValue = useMemo(() => ({
    selectedPeriod,
    setSelectedPeriod,
    selectedMarketplace,
    setSelectedMarketplace,
    selectedCountry,
    setSelectedCountry,
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    getDaysCount,
  }), [selectedPeriod, selectedMarketplace, selectedCountry, selectedCategory, selectedGender, getDaysCount]);

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


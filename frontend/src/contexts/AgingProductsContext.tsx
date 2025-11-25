import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AgingProductsContextType {
  selectedDays: number | null;
  setSelectedDays: (days: number | null) => void;
}

const AgingProductsContext = createContext<AgingProductsContextType | undefined>(undefined);

export const AgingProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  return (
    <AgingProductsContext.Provider value={{ selectedDays, setSelectedDays }}>
      {children}
    </AgingProductsContext.Provider>
  );
};

export const useAgingProducts = () => {
  const context = useContext(AgingProductsContext);
  if (context === undefined) {
    throw new Error('useAgingProducts must be used within an AgingProductsProvider');
  }
  return context;
};


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FilterProvider } from '../contexts/FilterContext';
import Dashboard from '../pages/Dashboard';
import Performances from '../pages/Performances';
import Rentabilite from '../pages/Rentabilite';
import Stocks from '../pages/Stocks';
import Marketing from '../pages/Marketing';
import Traffic from '../pages/Traffic';

/**
 * Wrapper pour toutes les routes du dashboard
 * Le FilterProvider est ici pour que la période sélectionnée persiste entre les pages
 */
const DashboardRoutesContent: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="performances" element={<Performances />} />
      <Route path="rentabilite" element={<Rentabilite />} />
      <Route path="stocks" element={<Stocks />} />
      <Route path="marketing" element={<Marketing />} />
      <Route path="traffic" element={<Traffic />} />
    </Routes>
  );
};

export const DashboardRoutes: React.FC = () => {
  return (
    <FilterProvider>
      <DashboardRoutesContent />
    </FilterProvider>
  );
};


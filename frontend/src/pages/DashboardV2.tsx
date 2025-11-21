import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MenuItemId } from '../types/dashboard';
import { Sidebar } from '../components/dashboard/Sidebar';
import { SearchBar } from '../components/dashboard/SearchBar';
import { FilterBar } from '../components/dashboard/FilterBar';
import { KPIBar } from '../components/dashboard/KPIBar';
import { GraphicsBar } from '../components/dashboard/GraphicsBar';

const DashboardV2: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItemId>('accueil');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleMenuClick = useCallback((menu: MenuItemId) => {
    setActiveMenu(menu);
    // Les chemins seront ajoutés plus tard
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#E7EAF0] overflow-auto">
      {/* Dashboard Container - Responsive avec min-width pour desktop */}
      <div className="dashboard-container absolute w-[2560px] h-[1440px]">
        {/* Background */}
        <div className="absolute w-full h-full bg-[#E7EAF0] rounded-[15px]"></div>

        {/* Menu Sidebar */}
        <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

        {/* Main Content - 2200px x 950px - Ajusté pour le padding du sidebar */}
        <div className="absolute left-[340px] top-0 w-[2200px] h-[950px]">
          {/* Search bar + logout button */}
          <SearchBar value={searchQuery} onChange={handleSearchChange} />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="absolute right-[17px] top-[25px] w-[165px] h-[50px] bg-white rounded-[10px] border-none cursor-pointer flex items-center justify-center hover:bg-gray-50 shadow-sm"
            aria-label="Déconnexion"
          >
            <span className="w-[141px] h-[40px] font-['Lato'] font-medium text-[24px] leading-[40px] text-[#1D1D1D] flex items-center justify-center">
              Déconnexion
            </span>
          </button>

          {/* Filter bar */}
          <FilterBar userName={user?.name || 'Admin'} />

          {/* KPI bar */}
          <KPIBar />

          {/* Graphics containers bar */}
          <GraphicsBar />
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;


import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FilterProvider } from '../contexts/FilterContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { SearchBar } from '../components/dashboard/SearchBar';
import { LogoutButton } from '../components/dashboard/LogoutButton';
import { FilterBar } from '../components/dashboard/FilterBar';
import { KPIBar } from '../components/dashboard/KPIBar';
import { GraphicsBar } from '../components/dashboard/GraphicsBar';
import { MenuItemId } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItemId>('accueil');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (menu: MenuItemId) => {
    setActiveMenu(menu);
    // Les chemins seront ajoutés plus tard
  };

  return (
    <FilterProvider>
      <div className="relative w-full h-screen bg-[#E7EAF0] overflow-auto">
        {/* Dashboard Container - Responsive avec min-width pour desktop */}
        <div className="dashboard-container absolute w-[2560px] h-[1440px]">
          {/* Background */}
          <div className="absolute w-full h-full bg-[#E7EAF0] rounded-[15px]"></div>

          {/* Menu Sidebar */}
          <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

          {/* Main Content - 2200px x 950px - Ajusté pour le padding du sidebar */}
          <div className="absolute left-[340px] top-0 w-[2200px] h-[950px]">
            {/* Search bar */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Logout Button */}
            <LogoutButton onLogout={handleLogout} />

            {/* Filter bar */}
            <FilterBar userName={user?.name || 'Admin'} />

            {/* KPI bar */}
            <KPIBar />

            {/* Graphics containers bar */}
            <GraphicsBar />
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default Dashboard;

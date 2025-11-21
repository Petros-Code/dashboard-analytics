import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { LogoutButton } from './LogoutButton';
import { FilterBar } from './FilterBar';
import { KPIBar } from './KPIBar';
import { GraphicsBar } from './GraphicsBar';
import { MenuItemId } from '../../types/dashboard';

interface DashboardLayoutProps {
  section: MenuItemId;
}

/**
 * Layout générique pour toutes les pages du dashboard
 * Accepte une prop 'section' pour identifier la section active
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ section }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItemId>(section);
  const [searchQuery, setSearchQuery] = useState('');

  // Mettre à jour le menu actif quand la section change
  useEffect(() => {
    setActiveMenu(section);
  }, [section]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (menu: MenuItemId) => {
    setActiveMenu(menu);
    // Navigation sera gérée par les routes React Router dans Sidebar
  };

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
          {/* Search bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Logout Button */}
          <LogoutButton onLogout={handleLogout} />

          {/* Filter bar */}
          <FilterBar userName={user?.name || 'Admin'} />

          {/* KPI bar */}
          <KPIBar />

          {/* Graphics containers bar */}
          <GraphicsBar section={section} />
        </div>
      </div>
    </div>
  );
};


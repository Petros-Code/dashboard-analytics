import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from './MenuItem';
import { MenuItemId } from '../../types/dashboard';
import { MENU_ITEMS } from '../../constants/dashboard';

interface SidebarProps {
  activeMenu: MenuItemId;
  onMenuClick: (id: MenuItemId) => void;
}

const MENU_ROUTES: Record<MenuItemId, string> = {
  accueil: '/dashboard',
  performances: '/dashboard/performances',
  rentabilite: '/dashboard/rentabilite',
  stocks: '/dashboard/stocks',
  marketing: '/dashboard/marketing',
  traffic: '/dashboard/traffic',
};

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  const navigate = useNavigate();
  
  // Calcul des positions avec espacement uniforme
  // Chaque item a une hauteur de 50px, espacement de 10px entre chaque item
  const ITEM_HEIGHT = 50;
  const ITEM_SPACING = 10;
  const FIRST_ITEM_TOP = 36;
  
  const menuTopPositions = MENU_ITEMS.map((_, index) => {
    return FIRST_ITEM_TOP + index * (ITEM_HEIGHT + ITEM_SPACING);
  });

  const handleMenuItemClick = (id: MenuItemId) => {
    onMenuClick(id);
    const route = MENU_ROUTES[id];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="absolute w-[300px] h-[1200px] left-[20px] top-[20px] bg-white rounded-[15px] flex-shrink-0 shadow-lg">
      {/* Logo + Nom */}
      <div className="absolute left-[71px] top-[41px] w-[159px] h-[201px]">
        <h1 className="absolute left-[-2px] top-0 w-[163px] h-[40px] font-['Oswald'] font-medium text-[40px] leading-[40px] text-[#1D1D1D] flex items-center justify-center">
          Dashboard
        </h1>
        <div className="absolute left-[42px] top-[67px] w-[75px] h-[75px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-purple-300 rounded-full"></div>
        </div>
        <p className="absolute left-[16px] top-[161px] w-[126px] h-[40px] font-['Lato'] font-medium text-[31px] leading-[40px] text-[#251C37] flex items-center justify-center">
          Meduza
        </p>
      </div>

      {/* Sections Menu */}
      <div className="absolute left-0 top-[264px] w-[300px] h-[800px]">
        {MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeMenu === item.id}
            onClick={handleMenuItemClick}
            top={menuTopPositions[index]}
          />
        ))}
      </div>
    </div>
  );
};


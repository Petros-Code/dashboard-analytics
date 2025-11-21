import React from 'react';
import { MenuItem } from './MenuItem';
import { MenuItemId } from '../../types/dashboard';
import { MENU_ITEMS } from '../../constants/dashboard';

interface SidebarProps {
  activeMenu: MenuItemId;
  onMenuClick: (id: MenuItemId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  const menuTopPositions = [36, 91, 136, 186, 236, 286];

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
            onClick={onMenuClick}
            top={menuTopPositions[index]}
          />
        ))}
      </div>
    </div>
  );
};


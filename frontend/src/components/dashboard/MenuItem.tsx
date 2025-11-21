import React from 'react';
import { MenuItemId } from '../../types/dashboard';

interface MenuItemProps {
  id: MenuItemId;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (id: MenuItemId) => void;
  top: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({ id, label, icon, isActive, onClick, top }) => {
  const activeColor = isActive ? '#1D1D1D' : '#7A7795';
  
  return (
    <button
      onClick={() => onClick(id)}
      className={`absolute left-[24px] w-[220px] h-[50px] rounded-[10px] border-none cursor-pointer transition-colors ${
        isActive ? 'bg-[#E7EAF0]' : 'bg-transparent hover:bg-[#E7EAF0]'
      }`}
      style={{ top: `${top}px` }}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="absolute left-[18px] top-[7px] w-[35px] h-[35px] flex items-center justify-center">
        <div style={{ color: activeColor }}>{icon}</div>
      </div>
      <span
        className={`absolute left-[72px] top-[5px] w-auto h-[40px] font-['Lato'] font-medium text-[24px] leading-[40px] flex items-center justify-center ${
          isActive ? 'text-[#1D1D1D]' : 'text-[#7A7795]'
        }`}
      >
        {label}
      </span>
    </button>
  );
};


import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="absolute right-[17px] top-[25px] w-[165px] h-[50px] bg-white rounded-[10px] border-none cursor-pointer flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors"
      aria-label="Déconnexion"
    >
      <span className="w-[141px] h-[40px] font-['Lato'] font-medium text-[24px] leading-[40px] text-[#1D1D1D] flex items-center justify-center">
        Déconnexion
      </span>
    </button>
  );
};


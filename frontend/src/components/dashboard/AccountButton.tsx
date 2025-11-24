import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AccountButtonProps {
  className?: string;
}

export const AccountButton: React.FC<AccountButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/account');
  };

  return (
    <button
      onClick={handleAccountClick}
      className={`absolute right-[192px] top-[25px] w-[165px] h-[50px] bg-white rounded-[10px] border-none cursor-pointer flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors ${className}`}
      aria-label="Compte"
    >
      <span className="w-[141px] h-[40px] font-['Lato'] font-medium text-[24px] leading-[40px] text-[#1D1D1D] flex items-center justify-center">
        Compte
      </span>
    </button>
  );
};


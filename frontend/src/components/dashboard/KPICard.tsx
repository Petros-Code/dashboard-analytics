import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  left: number;
  isBold?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, description, icon, left, isBold = false }) => {
  return (
    <div className="absolute bg-[#E7EAF0] rounded-[10px]" style={{ left: `${left}px`, top: '9px', width: '360px', height: '180px' }}>
      <div className="absolute left-[13px] top-[45px] w-[80px] h-[80px] flex items-center justify-center">
        {icon}
      </div>
      <p className={`absolute left-[177px] top-[54px] w-[187px] h-[30px] font-['Lato'] ${isBold ? 'font-bold' : 'font-medium'} text-[24px] leading-[40px] text-[#1D1D1D] flex items-center`}>
        {title}
      </p>
      <p className="absolute left-[177px] top-[84px] w-[187px] h-[30px] font-['Lato'] font-medium text-[24px] leading-[40px] text-[#1D1D1D] flex items-center">
        {value}
      </p>
      <p className="absolute left-[177px] top-[114px] w-[187px] h-[30px] font-['Lato'] font-medium text-[16px] leading-[40px] text-[#1D1D1D] flex items-center">
        {description}
      </p>
    </div>
  );
};


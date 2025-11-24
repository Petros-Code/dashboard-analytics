import React, { useState } from 'react';
import { FaSync } from 'react-icons/fa';

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  left: number;
  isBold?: boolean;
  isFlippable?: boolean;
  flipTitle?: string;
  flipValue?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  left, 
  isBold = false,
  isFlippable = false,
  flipTitle,
  flipValue
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="absolute rounded-[10px]"
      style={{ 
        left: `${left}px`, 
        top: '9px', 
        width: '360px', 
        height: '180px',
        perspective: '1000px'
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Face avant */}
        <div 
          className="absolute w-full h-full bg-[#E7EAF0] rounded-[10px]"
          style={{ 
            transform: 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className="w-full h-full flex items-center justify-around px-6">
            {/* Icône */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              {icon}
              {isFlippable && (
                <button
                  onClick={handleFlip}
                  className="mt-2 w-[32px] h-[32px] rounded-full bg-[#1D1D1D] hover:bg-[#3B3B3B] flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  aria-label="Retourner la carte"
                >
                  <FaSync className="w-[16px] h-[16px] text-white" />
                </button>
              )}
            </div>
            
            {/* Contenu texte */}
            <div className="flex-1 flex flex-col justify-center ml-8">
              <p className={`font-['Lato'] ${isBold ? 'font-bold' : 'font-medium'} text-[18px] leading-[25px] text-[#1D1D1D] mb-2`}>
                {title}
              </p>
              <p className="font-['Lato'] font-medium text-[22px] leading-[30px] text-[#1D1D1D] mb-1">
                {value}
              </p>
              <p className="font-['Lato'] font-medium text-[14px] leading-[20px] text-[#1D1D1D]">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Face arrière (si flippable) */}
        {isFlippable && (
          <div 
            className="absolute w-full h-full bg-[#E7EAF0] rounded-[10px]"
            style={{ 
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="w-full h-full flex items-center justify-around px-6">
              {/* Icône */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center">
                {icon}
                <button
                  onClick={handleFlip}
                  className="mt-2 w-[32px] h-[32px] rounded-full bg-[#1D1D1D] hover:bg-[#3B3B3B] flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  aria-label="Retourner la carte"
                >
                  <FaSync className="w-[16px] h-[16px] text-white" />
                </button>
              </div>
              
              {/* Contenu texte */}
              <div className="flex-1 flex flex-col justify-center ml-8">
                <p className={`font-['Lato'] ${isBold ? 'font-bold' : 'font-medium'} text-[18px] leading-[25px] text-[#1D1D1D] mb-2`}>
                  {flipTitle || title}
                </p>
                <p className="font-['Lato'] font-medium text-[22px] leading-[30px] text-[#1D1D1D] mb-1">
                  {flipValue || value}
                </p>
                <p className="font-['Lato'] font-medium text-[14px] leading-[20px] text-[#1D1D1D]">
                  {description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


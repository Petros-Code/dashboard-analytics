import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="absolute left-0 top-[25px] w-[1000px] h-[50px] bg-white rounded-[10px] flex items-center pl-4 pr-4 border border-transparent focus-within:border-[#7A7795] transition-colors shadow-sm">
      <svg className="w-[28px] h-[28px] text-[#7A7795] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher..."
        className="flex-1 ml-2 outline-none border-none bg-transparent font-['Lato'] text-[16px] text-[#1D1D1D] placeholder:text-[#7A7795]"
        aria-label="Rechercher"
      />
    </div>
  );
};


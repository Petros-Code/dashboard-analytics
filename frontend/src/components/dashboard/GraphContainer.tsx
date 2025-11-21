import React from 'react';

interface GraphContainerProps {
  id: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

export const GraphContainer: React.FC<GraphContainerProps> = ({ id, width, height, left, top }) => {
  return (
    <div
      className="absolute bg-white rounded-[10px]"
      style={{ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }}
      role="region"
      aria-label={`Graphique ${id}`}
    >
      <div className="absolute inset-0 flex items-center justify-center pt-12">
        <p className="text-[#7A778E]">Graphique à venir</p>
      </div>
    </div>
  );
};


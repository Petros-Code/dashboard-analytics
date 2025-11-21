import React from 'react';
import { GraphContainer } from './GraphContainer';
import { GRAPH_CONTAINERS } from '../../constants/dashboard';

export const GraphicsBar: React.FC = () => {
  return (
    <div className="absolute left-0 top-[447px] w-[2200px]">
      {GRAPH_CONTAINERS.map((container) => (
        <GraphContainer
          key={container.id}
          id={container.id}
          width={container.width}
          height={container.height}
          left={container.left}
          top={container.top}
        />
      ))}
    </div>
  );
};


import React from 'react';
import { GraphContainer } from './GraphContainer';
import { GRAPH_CONTAINERS } from '../../constants/dashboard';
import { MenuItemId } from '../../types/dashboard';

interface GraphicsBarProps {
  section: MenuItemId;
}

export const GraphicsBar: React.FC<GraphicsBarProps> = ({ section: _section }) => {
  // Pour l'instant, toutes les sections utilisent les mêmes graphiques
  // Plus tard, on pourra avoir des graphiques différents par section en utilisant la prop 'section'
  // Exemple: const containers = getGraphContainersForSection(section);
  const containers = GRAPH_CONTAINERS;

  return (
    <div className="absolute left-0 top-[447px] w-[2200px]">
      {containers.map((container) => (
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


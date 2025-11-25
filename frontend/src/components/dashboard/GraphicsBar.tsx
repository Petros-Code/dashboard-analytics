import React from 'react';
import { GraphContainer } from './GraphContainer';
import { AgingProductsTable } from './AgingProductsTable';
import { useAgingProducts } from '../../contexts/AgingProductsContext';
import { GRAPH_CONTAINERS, RENTABILITE_GRAPH_CONTAINERS, TRAFFIC_GRAPH_CONTAINERS, PERFORMANCES_GRAPH_CONTAINERS, STOCKS_GRAPH_CONTAINERS, MARKETING_GRAPH_CONTAINERS } from '../../constants/dashboard';
import { MenuItemId } from '../../types/dashboard';

interface GraphicsBarProps {
  section: MenuItemId;
  containers?: Array<{
    id: string;
    width: number;
    height: number;
    left: number;
    top: number;
  }>;
}

/**
 * Composant réutilisable pour afficher les graphiques selon la section
 * Par défaut, affiche les graphiques uniquement sur la page Accueil
 * Peut accepter des containers personnalisés via la prop containers
 */
export const GraphicsBar: React.FC<GraphicsBarProps> = ({ section, containers }) => {
  const { selectedDays } = useAgingProducts();
  
  // Déterminer les containers à utiliser
  let graphContainers = containers;
  
  if (!graphContainers) {
    // Utiliser les containers spécifiques selon la section
    if (section === 'rentabilite') {
      graphContainers = RENTABILITE_GRAPH_CONTAINERS;
    } else if (section === 'traffic') {
      graphContainers = TRAFFIC_GRAPH_CONTAINERS;
    } else if (section === 'performances') {
      graphContainers = PERFORMANCES_GRAPH_CONTAINERS;
    } else if (section === 'stocks') {
      graphContainers = STOCKS_GRAPH_CONTAINERS;
    } else if (section === 'marketing') {
      graphContainers = MARKETING_GRAPH_CONTAINERS;
    } else if (section === 'accueil') {
      graphContainers = GRAPH_CONTAINERS;
    } else {
      // Pour les autres sections, containers vides
      graphContainers = [];
    }
  }

  // Si pas de containers, afficher un conteneur vide
  if (graphContainers.length === 0) {
    return (
      <div className="absolute left-0 top-[447px] w-[2200px]">
        {/* Containers vides pour cette section - prêts pour les graphiques futurs */}
      </div>
    );
  }

  // Calculer la position du tableau (sous le dernier graphique)
  const lastGraphTop = graphContainers.length > 0 
    ? Math.max(...graphContainers.map(c => c.top + c.height))
    : 447;
  const tableTop = lastGraphTop + 20; // 20px d'espacement

  return (
    <div className="absolute left-0 top-[447px] w-[2200px]">
      {graphContainers.map((container) => (
        <GraphContainer
          key={container.id}
          id={container.id}
          width={container.width}
          height={container.height}
          left={container.left}
          top={container.top}
        />
      ))}
      {/* Tableau des produits vieillissants pour la section Stocks */}
      {section === 'stocks' && (
        <div 
          className="absolute"
          style={{ left: '0px', top: `${tableTop}px`, width: '2200px' }}
        >
          <AgingProductsTable days={selectedDays} />
        </div>
      )}
    </div>
  );
};


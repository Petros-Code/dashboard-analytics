import React, { useMemo } from 'react';
import { KPICard } from './KPICard';
import { KPI_CARDS, KPI_POSITIONS } from '../../constants/dashboard';
import { useFilters } from '../../contexts/FilterContext';
import { dashboardService } from '../../services/dashboardService';
import { useKPIData } from '../../hooks/useKPIData';
import { formatDaysText } from '../../utils/dateUtils';

export const KPIBar: React.FC = () => {
  const { selectedPeriod, getDaysCount } = useFilters();
  
  // Récupération des données pour les KPIs dynamiques
  const ordersData = useKPIData(
    dashboardService.getOrdersCount,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate
  );
  
  const deliveriesData = useKPIData(
    dashboardService.getDeliveriesCount,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate
  );

  // Mapping des données par KPI ID
  const kpiDataMap = useMemo(() => ({
    commandes: ordersData,
    livraisons: deliveriesData,
  }), [ordersData, deliveriesData]);

  // Formatage du texte des jours
  const daysText = useMemo(() => {
    const daysCount = getDaysCount();
    return formatDaysText(daysCount);
  }, [getDaysCount]);

  return (
    <div className="absolute left-0 top-[225px] w-[2200px] h-[197px] bg-white rounded-[10px] shadow-sm">
      {KPI_CARDS.map((card, index) => {
        const kpiData = kpiDataMap[card.id as keyof typeof kpiDataMap];
        
        let displayValue = card.value;
        let displayDescription = card.description;
        
        // KPIs dynamiques (commandes, livraisons)
        if (kpiData) {
          displayValue = kpiData.isLoading ? '...' : kpiData.count.toString();
          displayDescription = daysText || card.description;
        }
        // Autres KPIs : remplacer la description par le nombre de jours si une période est sélectionnée
        // Sauf pour "valeur-stock" qui garde "(prix de vente)"
        else if (card.id !== 'valeur-stock' && daysText) {
          displayDescription = daysText;
        }

        return (
          <KPICard
            key={card.id}
            title={card.title}
            value={displayValue}
            description={displayDescription}
            icon={card.icon}
            left={KPI_POSITIONS[index].left}
            isBold={card.id === 'marge-nette'}
          />
        );
      })}
    </div>
  );
};


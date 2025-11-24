import React, { useMemo } from 'react';
import { KPICard } from './KPICard';
import { KPI_CARDS, KPI_POSITIONS, RENTABILITE_KPI_CARDS, TRAFFIC_KPI_CARDS, PERFORMANCES_KPI_CARDS } from '../../constants/dashboard';
import { useFilters } from '../../contexts/FilterContext';
import { dashboardService } from '../../services/dashboardService';
import { useKPIData } from '../../hooks/useKPIData';
import { formatDaysText } from '../../utils/dateUtils';
import { MenuItemId } from '../../types/dashboard';

/**
 * Formate un montant en euros avec séparateurs de milliers
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface KPIBarProps {
  section?: MenuItemId;
}

export const KPIBar: React.FC<KPIBarProps> = ({ section = 'accueil' }) => {
  // Sections pour lesquelles on vide les KPIs
  const emptyKPISections: MenuItemId[] = ['stocks', 'marketing'];
  
  // Hooks doivent être appelés avant tout return conditionnel
  const { selectedPeriod, selectedMarketplace, selectedCountry, getDaysCount } = useFilters();
  
  // Si la section est dans la liste vide, on affiche une barre vide
  if (emptyKPISections.includes(section)) {
    return (
      <div className="absolute left-0 top-[225px] w-[2200px] h-[197px] bg-white rounded-[10px] shadow-sm">
        {/* Barre KPI vide pour cette section */}
      </div>
    );
  }

  // Sélectionner les KPIs selon la section
  let kpiCards = KPI_CARDS;
  if (section === 'rentabilite') {
    kpiCards = RENTABILITE_KPI_CARDS;
  } else if (section === 'traffic') {
    kpiCards = TRAFFIC_KPI_CARDS;
  } else if (section === 'performances') {
    kpiCards = PERFORMANCES_KPI_CARDS;
  }
  
  // Récupération des données pour tous les KPIs (uniquement pour la page Accueil)
  const ordersData = useKPIData(
    dashboardService.getOrdersCount,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate,
    selectedMarketplace,
    selectedCountry
  );
  
  const deliveriesData = useKPIData(
    dashboardService.getDeliveriesCount,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate,
    selectedMarketplace,
    selectedCountry
  );

  const revenueData = useKPIData(
    dashboardService.getRevenueTotal,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate,
    selectedMarketplace,
    selectedCountry
  );

  const netMarginData = useKPIData(
    dashboardService.getNetMarginTotal,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate,
    selectedMarketplace,
    selectedCountry
  );

  const stockValueData = useKPIData(
    dashboardService.getStockValueTotal,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate
  );

  // Mapping des données par KPI ID (uniquement pour la page Accueil)
  const kpiDataMap = useMemo(() => ({
    commandes: ordersData,
    livraisons: deliveriesData,
    'chiffre-affaires': revenueData,
    'marge-nette': netMarginData,
    'valeur-stock': stockValueData,
  }), [ordersData, deliveriesData, revenueData, netMarginData, stockValueData]);

  // Formatage du texte des jours
  const daysText = useMemo(() => {
    const daysCount = getDaysCount();
    return formatDaysText(daysCount);
  }, [getDaysCount]);

  return (
    <div className="absolute left-0 top-[225px] w-[2200px] h-[197px] bg-white rounded-[10px] shadow-sm">
      {kpiCards.map((card, index) => {
        // Pour la page Accueil, récupérer les données dynamiques
        const kpiData = section === 'accueil' ? kpiDataMap[card.id as keyof typeof kpiDataMap] : undefined;
        
        let displayValue = card.value;
        let displayDescription = card.description;
        
        // Pour les pages Rentabilité, Traffic et Performances, les KPIs sont statiques pour l'instant
        if (section === 'rentabilite' || section === 'traffic' || section === 'performances') {
          // TODO: Implémenter les calculs de rentabilité, traffic et performances
          // Pour l'instant, on garde les valeurs par défaut
          // La description est déjà correcte dans la configuration
        } else {
          // KPIs dynamiques pour la page Accueil
          if (kpiData) {
            if (kpiData.isLoading) {
              displayValue = '...';
            } else {
              // Formater selon le type de KPI
              if (card.id === 'chiffre-affaires' || card.id === 'marge-nette' || card.id === 'valeur-stock') {
                displayValue = formatCurrency(kpiData.value);
              } else {
                displayValue = kpiData.value.toString();
              }
            }
            
            // Mettre à jour la description avec le nombre de jours
            if (card.id === 'valeur-stock') {
              displayDescription = '(prix de vente)';
            } else if (daysText) {
              displayDescription = daysText;
            }
          }
          // Fallback pour les KPIs non chargés
          else if (card.id !== 'valeur-stock' && daysText) {
            displayDescription = daysText;
          }
        }

        return (
          <KPICard
            key={card.id}
            title={card.title}
            value={displayValue}
            description={displayDescription}
            icon={card.icon}
            left={KPI_POSITIONS[index].left}
            isBold={card.id === 'marge-nette' || card.id === 'marge-nette-moyenne' || card.id === 'meilleure-categorie'}
            isFlippable={card.id === 'meilleure-categorie'}
            flipTitle="Plus faible performance par catégorie"
            flipValue={displayValue}
          />
        );
      })}
    </div>
  );
};


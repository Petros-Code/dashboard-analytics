import React, { useMemo, useState, useEffect } from 'react';
import { KPICard } from './KPICard';
import { KPI_CARDS, KPI_POSITIONS, RENTABILITE_KPI_CARDS, TRAFFIC_KPI_CARDS, PERFORMANCES_KPI_CARDS, STOCKS_KPI_CARDS, MARKETING_KPI_CARDS } from '../../constants/dashboard';
import { useFilters } from '../../contexts/FilterContext';
import { useAgingProducts } from '../../contexts/AgingProductsContext';
import { dashboardService } from '../../services/dashboardService';
import { useKPIData } from '../../hooks/useKPIData';
import { formatDaysText } from '../../utils/dateUtils';
import { MenuItemId } from '../../types/dashboard';
import { AgingProductsButtons } from './AgingProductsButtons';

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
  // Hooks doivent être appelés avant tout return conditionnel
  const { selectedPeriod, selectedMarketplace, selectedCountry, getDaysCount } = useFilters();
  const { selectedDays, setSelectedDays } = useAgingProducts();
  
  // Récupération des données pour tous les KPIs (toujours appelés pour éviter les erreurs de hooks)
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

  // Données pour les KPIs Stocks
  const stocksOnlineData = useKPIData(
    dashboardService.getStocksOnlineCount
  );
  const stocksDraftData = useKPIData(
    dashboardService.getStocksDraftCount
  );
  const stocksAveragePriceData = useKPIData(
    dashboardService.getStocksAveragePurchasePrice,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate
  );
  const stocksAverageDaysData = useKPIData(
    dashboardService.getStocksAverageDays,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate
  );

  // Données pour les KPIs Marketing
  const instagramFollowersData = useKPIData(
    dashboardService.getInstagramFollowersCurrent
  );
  const tiktokFollowersData = useKPIData(
    dashboardService.getTikTokFollowersCurrent
  );
  const promoCodesTotalUsageData = useKPIData(
    dashboardService.getPromoCodesTotalUsage,
    selectedPeriod?.startDate,
    selectedPeriod?.endDate,
    selectedMarketplace,
    selectedCountry
  );
  
  // Pour le code promo le plus utilisé, on doit utiliser un hook personnalisé car la réponse est différente
  const [mostUsedPromoCode, setMostUsedPromoCode] = useState<{ code: string | null; usage_count: number } | null>(null);
  const [loadingMostUsedPromoCode, setLoadingMostUsedPromoCode] = useState(false);

  useEffect(() => {
    const fetchMostUsedPromoCode = async () => {
      setLoadingMostUsedPromoCode(true);
      try {
        const response = await dashboardService.getPromoCodesMostUsed(
          selectedPeriod?.startDate || undefined,
          selectedPeriod?.endDate || undefined,
          selectedMarketplace,
          selectedCountry
        );
        setMostUsedPromoCode({
          code: response.code || null,
          usage_count: response.usage_count || 0
        });
      } catch (error) {
        console.error('Error fetching most used promo code:', error);
        setMostUsedPromoCode({ code: null, usage_count: 0 });
      } finally {
        setLoadingMostUsedPromoCode(false);
      }
    };

    fetchMostUsedPromoCode();
  }, [selectedPeriod, selectedMarketplace, selectedCountry]);

  // Mapping des données par KPI ID (uniquement pour la page Accueil)
  const kpiDataMap = useMemo(() => ({
    commandes: ordersData,
    livraisons: deliveriesData,
    'chiffre-affaires': revenueData,
    'marge-nette': netMarginData,
    'valeur-stock': stockValueData,
  }), [ordersData, deliveriesData, revenueData, netMarginData, stockValueData]);

  // Mapping des données pour les KPIs Stocks
  const stocksKpiDataMap = useMemo(() => ({
    'stocks-en-ligne': stocksOnlineData,
    'stocks-en-cours': stocksDraftData,
    'prix-achat-moyen': stocksAveragePriceData,
    'jours-stock-moyen': stocksAverageDaysData,
  }), [stocksOnlineData, stocksDraftData, stocksAveragePriceData, stocksAverageDaysData]);

  // Mapping des données pour les KPIs Marketing
  const marketingKpiDataMap = useMemo(() => ({
    'instagram-abonnes-actuel': instagramFollowersData,
    'tiktok-abonnes-actuel': tiktokFollowersData,
    'codes-promo-total': promoCodesTotalUsageData,
  }), [instagramFollowersData, tiktokFollowersData, promoCodesTotalUsageData]);

  // Formatage du texte des jours
  const daysText = useMemo(() => {
    const daysCount = getDaysCount();
    return formatDaysText(daysCount);
  }, [getDaysCount]);

  // Sections pour lesquelles on vide les KPIs
  const emptyKPISections: MenuItemId[] = [];
  
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
  } else if (section === 'stocks') {
    kpiCards = STOCKS_KPI_CARDS;
  } else if (section === 'marketing') {
    kpiCards = MARKETING_KPI_CARDS;
  }

  return (
    <div className="absolute left-0 top-[225px] w-[2200px] h-[197px] bg-white rounded-[10px] shadow-sm">
      {kpiCards.map((card, index) => {
        // Pour la page Accueil, récupérer les données dynamiques
        const kpiData = section === 'accueil' ? kpiDataMap[card.id as keyof typeof kpiDataMap] : undefined;
        
        // Pour la page Stocks, récupérer les données dynamiques
        const stocksKpiData = section === 'stocks' ? stocksKpiDataMap[card.id as keyof typeof stocksKpiDataMap] : undefined;
        
        // Pour la page Marketing, récupérer les données dynamiques
        const marketingKpiData = section === 'marketing' ? marketingKpiDataMap[card.id as keyof typeof marketingKpiDataMap] : undefined;
        
        let displayValue = card.value;
        let displayDescription = card.description;
        
        // Pour les pages Rentabilité, Traffic et Performances, les KPIs sont statiques pour l'instant
        if (section === 'rentabilite' || section === 'traffic' || section === 'performances') {
          // TODO: Implémenter les calculs de rentabilité, traffic et performances
          // Pour l'instant, on garde les valeurs par défaut
          // La description est déjà correcte dans la configuration
        } else if (section === 'marketing') {
          // KPIs dynamiques pour la page Marketing
          if (card.id === 'instagram-abonnes-actuel' || card.id === 'tiktok-abonnes-actuel') {
            if (marketingKpiData) {
              if (marketingKpiData.isLoading) {
                displayValue = '...';
              } else {
                displayValue = marketingKpiData.value.toLocaleString();
              }
            }
          } else if (card.id === 'codes-promo-total') {
            if (marketingKpiData) {
              if (marketingKpiData.isLoading) {
                displayValue = '...';
              } else {
                displayValue = marketingKpiData.value.toString();
              }
            }
          } else if (card.id === 'code-promo-plus-utilise') {
            if (loadingMostUsedPromoCode) {
              displayValue = '...';
            } else if (mostUsedPromoCode && mostUsedPromoCode.code) {
              displayValue = mostUsedPromoCode.code;
            } else {
              displayValue = '-';
            }
          }
        } else if (section === 'stocks') {
          // KPIs dynamiques pour la page Stocks
          if (stocksKpiData) {
            if (stocksKpiData.isLoading) {
              displayValue = '...';
            } else {
              if (card.id === 'stocks-en-ligne' || card.id === 'stocks-en-cours') {
                displayValue = stocksKpiData.value.toString();
              } else if (card.id === 'prix-achat-moyen') {
                displayValue = formatCurrency(stocksKpiData.value);
              } else if (card.id === 'jours-stock-moyen') {
                displayValue = Math.round(stocksKpiData.value).toString();
              }
            }
          }
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

        // Largeur personnalisée pour le KPI "jours-stock-moyen"
        const customWidth = card.id === 'jours-stock-moyen' ? 600 : undefined;
        const customButtons = card.id === 'jours-stock-moyen' ? (
          <AgingProductsButtons 
            selectedDays={selectedDays} 
            onDaysChange={setSelectedDays} 
          />
        ) : undefined;

        return (
          <KPICard
            key={card.id}
            title={card.title}
            value={displayValue}
            description={displayDescription}
            icon={card.icon}
            left={KPI_POSITIONS[index].left}
            width={customWidth}
            isBold={card.id === 'marge-nette' || card.id === 'marge-nette-moyenne' || card.id === 'meilleure-categorie'}
            isFlippable={card.id === 'meilleure-categorie'}
            flipTitle="Plus faible performance par catégorie"
            flipValue={displayValue}
            customButtons={customButtons}
          />
        );
      })}
    </div>
  );
};


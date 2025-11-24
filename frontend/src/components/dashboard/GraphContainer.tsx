import React from 'react';
import { SalesChart } from './charts/SalesChart';
import { RevenueChart } from './charts/RevenueChart';
import { NetMarginChart } from './charts/NetMarginChart';
import { StockValueChart } from './charts/StockValueChart';
import { NewCustomersChart } from './charts/NewCustomersChart';
import { GrossMarginDailyChart } from './charts/GrossMarginDailyChart';
import { NetMarginDailyChart } from './charts/NetMarginDailyChart';
import { MarginCoefficientDailyChart } from './charts/MarginCoefficientDailyChart';
import { MarginRateDailyChart } from './charts/MarginRateDailyChart';
import { MarkupRateDailyChart } from './charts/MarkupRateDailyChart';
import { CartAbandonmentDailyChart } from './charts/CartAbandonmentDailyChart';
import { BounceRateDailyChart } from './charts/BounceRateDailyChart';
import { VisitDurationDailyChart } from './charts/VisitDurationDailyChart';
import { UniqueVisitsDailyChart } from './charts/UniqueVisitsDailyChart';
import { ConversionRateDailyChart } from './charts/ConversionRateDailyChart';
import { ItemsSoldDailyChart } from './charts/ItemsSoldDailyChart';
import { OrdersDailyChart } from './charts/OrdersDailyChart';
import { AveragePriceDailyChart } from './charts/AveragePriceDailyChart';
import { AverageBasketDailyChart } from './charts/AverageBasketDailyChart';
import { ItemsPerOrderDailyChart } from './charts/ItemsPerOrderDailyChart';

interface GraphContainerProps {
  id: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

const getChartComponent = (id: string) => {
  switch (id) {
    // Graphiques de la page Accueil
    case 'graph-1':
      return SalesChart;
    case 'graph-2':
      return RevenueChart;
    case 'graph-3':
      return NetMarginChart;
    case 'graph-4':
      return StockValueChart;
    case 'graph-5':
      return NewCustomersChart;
    // Graphiques de la page Rentabilité
    case 'rentabilite-graph-1':
      return GrossMarginDailyChart;
    case 'rentabilite-graph-2':
      return NetMarginDailyChart;
    case 'rentabilite-graph-3':
      return MarginCoefficientDailyChart;
    case 'rentabilite-graph-4':
      return MarginRateDailyChart;
    case 'rentabilite-graph-5':
      return MarkupRateDailyChart;
    // Graphiques de la page Traffic
    case 'traffic-graph-1':
      return CartAbandonmentDailyChart;
    case 'traffic-graph-2':
      return BounceRateDailyChart;
    case 'traffic-graph-3':
      return VisitDurationDailyChart;
    case 'traffic-graph-4':
      return UniqueVisitsDailyChart;
    case 'traffic-graph-5':
      return ConversionRateDailyChart;
    // Graphiques de la page Performances
    case 'performances-graph-1':
      return ItemsSoldDailyChart;
    case 'performances-graph-2':
      return OrdersDailyChart;
    case 'performances-graph-3':
      return AveragePriceDailyChart;
    case 'performances-graph-4':
      return AverageBasketDailyChart;
    case 'performances-graph-5':
      return ItemsPerOrderDailyChart;
    default:
      return null;
  }
};

export const GraphContainer: React.FC<GraphContainerProps> = ({ id, width, height, left, top }) => {
  const ChartComponent = getChartComponent(id);

  return (
    <div
      className="absolute bg-white rounded-[10px] shadow-sm"
      style={{ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }}
      role="region"
      aria-label={`Graphique ${id}`}
    >
      {ChartComponent ? (
        <ChartComponent width={width} height={height} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pt-12">
          <p className="text-[#7A778E]">Graphique à venir</p>
        </div>
      )}
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface PriceDataPoint {
  date: string;
  ttc: number;
  ht: number;
}

interface AveragePriceDailyChartProps {
  width: number;
  height: number;
}

export const AveragePriceDailyChart: React.FC<AveragePriceDailyChartProps> = ({ width, height }) => {
  const { selectedPeriod, selectedMarketplace, selectedCountry } = useFilters();
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Implémenter l'endpoint backend pour le prix de vente moyen TTC et HT par jour
        // Pour l'instant, données vides
        setData([]);
      } catch (error) {
        console.error('Error fetching average price daily chart data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, selectedMarketplace, selectedCountry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#7A778E]">Chargement...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-full p-4">
        <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Prix de vente moyen TTC et HT</h3>
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Graphique à venir</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Prix de vente moyen TTC et HT</h3>
      <ResponsiveContainer width="100%" height={height - 60}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7EAF0" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#7A778E', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis 
            tick={{ fill: '#7A778E', fontSize: 12 }}
            tickFormatter={(value) => `€${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E7EAF0',
              borderRadius: '8px'
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR');
            }}
            formatter={(value: number, name: string) => [
              `${value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
              name === 'ttc' ? 'TTC' : 'HT'
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ttc" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
            name="TTC"
          />
          <Line 
            type="monotone" 
            dataKey="ht" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
            name="HT"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


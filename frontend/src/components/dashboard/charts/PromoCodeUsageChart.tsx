import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface PromoCodeUsageChartProps {
  width: number;
  height: number;
}

export const PromoCodeUsageChart: React.FC<PromoCodeUsageChartProps> = ({ width, height }) => {
  const { selectedPeriod, selectedMarketplace, selectedCountry } = useFilters();
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getPromoCodeUsageChart(
          selectedPeriod?.startDate,
          selectedPeriod?.endDate,
          selectedMarketplace,
          selectedCountry
        );
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching promo code usage chart data:', error);
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

  return (
    <div className="w-full h-full p-4">
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Commandes avec code promo utilisé</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Aucune donnée disponible</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height - 60}>
          <BarChart data={data}>
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
              tickFormatter={(value) => value.toLocaleString()}
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
              formatter={(value: number) => [`${value.toLocaleString()}`, 'Commandes']}
            />
            <Bar 
              dataKey="value" 
              fill="#8B5CF6" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface InstagramFollowersChartProps {
  width: number;
  height: number;
}

export const InstagramFollowersChart: React.FC<InstagramFollowersChartProps> = ({ width, height }) => {
  const { selectedPeriod } = useFilters();
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getInstagramFollowersChart(
          selectedPeriod?.startDate,
          selectedPeriod?.endDate
        );
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching Instagram followers chart data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#7A778E]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Nombre d'abonnées par mois sur Instagram</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Aucune donnée disponible</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height - 60}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7EAF0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#7A778E', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <YAxis 
              tick={{ fill: '#7A778E', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E7EAF0',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
              }}
              formatter={(value: number) => [`${value.toLocaleString()}`, 'Abonnés']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#E4405F" 
              strokeWidth={2}
              dot={{ fill: '#E4405F', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface StockValueHTChartProps {
  width: number;
  height: number;
}

export const StockValueHTChart: React.FC<StockValueHTChartProps> = ({ width, height }) => {
  const { selectedPeriod } = useFilters();
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getStockValueHTChart(
          selectedPeriod?.startDate,
          selectedPeriod?.endDate
        );
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching stock value HT chart data:', error);
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
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Valeur du stock en prix de vente HT</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Aucune donnée disponible</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height - 60}>
          <AreaChart data={data}>
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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`}
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
              formatter={(value: number) => [
                `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)}`,
                'Valeur HT'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10B981" 
              fill="#10B981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


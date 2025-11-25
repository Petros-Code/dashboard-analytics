import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface StockByCategoryChartProps {
  width: number;
  height: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export const StockByCategoryChart: React.FC<StockByCategoryChartProps> = ({ width, height }) => {
  const { selectedPeriod } = useFilters();
  const [data, setData] = useState<{ category: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getStockByCategoryChart(
          selectedPeriod?.startDate,
          selectedPeriod?.endDate
        );
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching stock by category chart data:', error);
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
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Stock par catégorie de produit</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Aucune donnée disponible</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height - 60}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E7EAF0" />
            <XAxis 
              type="number"
              tick={{ fill: '#7A778E', fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis 
              type="category"
              dataKey="category" 
              tick={{ fill: '#7A778E', fontSize: 12 }}
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E7EAF0',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toLocaleString()}`, 'Articles']}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


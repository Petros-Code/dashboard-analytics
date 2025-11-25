import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface PublishedProductsChartProps {
  width: number;
  height: number;
}

type PeriodType = 'day' | 'week' | 'month' | 'year';

export const PublishedProductsChart: React.FC<PublishedProductsChartProps> = ({ width, height }) => {
  const { selectedPeriod } = useFilters();
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<PeriodType>('day');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getPublishedProductsChart(
          selectedPeriod?.startDate,
          selectedPeriod?.endDate,
          periodType
        );
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching published products chart data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, periodType]);

  const formatDate = (dateStr: string, type: PeriodType) => {
    const date = new Date(dateStr);
    switch (type) {
      case 'day':
        return `${date.getDate()}/${date.getMonth() + 1}`;
      case 'week':
        return `S${Math.ceil(date.getDate() / 7)}/${date.getMonth() + 1}`;
      case 'month':
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      case 'year':
        return date.getFullYear().toString();
      default:
        return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#7A778E]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#1D1D1D]">Nombre d'articles publiés</h3>
        <select
          value={periodType}
          onChange={(e) => setPeriodType(e.target.value as PeriodType)}
          className="px-3 py-1 border border-[#E7EAF0] rounded-md text-sm text-[#1D1D1D] bg-white"
        >
          <option value="day">Par jour</option>
          <option value="week">Par semaine</option>
          <option value="month">Par mois</option>
          <option value="year">Par année</option>
        </select>
      </div>
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
              tickFormatter={(value) => formatDate(value, periodType)}
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
              formatter={(value: number) => [`${value.toLocaleString()}`, 'Articles']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


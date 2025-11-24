import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService, ChartDataPoint } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface NewCustomersChartProps {
  width: number;
  height: number;
}

export const NewCustomersChart: React.FC<NewCustomersChartProps> = ({ width, height }) => {
  const { selectedPeriod, selectedMarketplace, selectedCountry } = useFilters();
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const startDate = selectedPeriod?.startDate || undefined;
        const endDate = selectedPeriod?.endDate || undefined;
        const marketplaceId = selectedMarketplace || undefined;
        const countryId = selectedCountry || undefined;
        
        const response = await dashboardService.getNewCustomersChart(startDate, endDate, marketplaceId, countryId);
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching new customers chart data:', error);
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
      <div className="flex items-center justify-center h-full">
        <p className="text-[#7A778E]">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">Nouveaux Clients</h3>
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
          <YAxis tick={{ fill: '#7A778E', fontSize: 12 }} />
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
            formatter={(value: number) => [`${value} clients`, 'Nouveaux clients']}
          />
          <Bar 
            dataKey="value" 
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


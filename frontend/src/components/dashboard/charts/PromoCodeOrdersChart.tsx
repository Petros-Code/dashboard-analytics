import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../../services/dashboardService';
import { useFilters } from '../../../contexts/FilterContext';

interface PromoCode {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
}

interface PromoCodeOrdersChartProps {
  width: number;
  height: number;
}

export const PromoCodeOrdersChart: React.FC<PromoCodeOrdersChartProps> = ({ width, height }) => {
  const { selectedPeriod, selectedMarketplace, selectedCountry } = useFilters();
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [selectedPromoCodeId, setSelectedPromoCodeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPromoCodes, setLoadingPromoCodes] = useState(true);

  // Charger la liste des codes promo
  useEffect(() => {
    const fetchPromoCodes = async () => {
      setLoadingPromoCodes(true);
      try {
        const response = await dashboardService.getPromoCodes();
        setPromoCodes(response.promo_codes || []);
        // Sélectionner le premier code promo par défaut s'il existe
        if (response.promo_codes && response.promo_codes.length > 0) {
          setSelectedPromoCodeId(response.promo_codes[0].id);
        }
      } catch (error) {
        console.error('Error fetching promo codes:', error);
        setPromoCodes([]);
      } finally {
        setLoadingPromoCodes(false);
      }
    };

    fetchPromoCodes();
  }, []);

  // Charger les données du graphique quand le code promo ou les filtres changent
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPromoCodeId) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await dashboardService.getPromoCodeOrdersChart(
          selectedPromoCodeId,
          selectedPeriod?.startDate,
          selectedPeriod?.endDate,
          selectedMarketplace,
          selectedCountry
        );
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching promo code orders chart data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPromoCodeId, selectedPeriod, selectedMarketplace, selectedCountry]);

  if (loadingPromoCodes) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#7A778E]">Chargement des codes promo...</p>
      </div>
    );
  }

  const selectedPromoCode = promoCodes.find(pc => pc.id === selectedPromoCodeId);

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#1D1D1D]">
          Commandes avec code promo spécifique
        </h3>
        <select
          value={selectedPromoCodeId || ''}
          onChange={(e) => setSelectedPromoCodeId(e.target.value ? parseInt(e.target.value) : null)}
          className="px-3 py-1 border border-[#E7EAF0] rounded-md text-sm text-[#1D1D1D] bg-white"
        >
          <option value="">Sélectionner un code promo</option>
          {promoCodes.map((pc) => (
            <option key={pc.id} value={pc.id}>
              {pc.code} {pc.is_active ? '' : '(inactif)'}
            </option>
          ))}
        </select>
      </div>
      {!selectedPromoCodeId ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Sélectionnez un code promo</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Chargement...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <p className="text-[#7A778E]">Aucune donnée disponible pour ce code promo</p>
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
              fill="#10B981" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


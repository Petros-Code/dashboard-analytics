import api from './api';

export interface OrdersCountResponse {
  count: number;
  start_date: string | null;
  end_date: string | null;
}

export interface DeliveriesCountResponse {
  count: number;
  start_date: string | null;
  end_date: string | null;
}

/**
 * Construit les paramètres de requête pour les dates
 */
const buildDateParams = (startDate?: string, endDate?: string): URLSearchParams => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  return params;
};

export const dashboardService = {
  getOrdersCount: async (startDate?: string, endDate?: string): Promise<OrdersCountResponse> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<OrdersCountResponse>(`/dashboard/orders/count?${params.toString()}`);
    return response.data;
  },

  getDeliveriesCount: async (startDate?: string, endDate?: string): Promise<DeliveriesCountResponse> => {
    // TODO: Créer l'endpoint backend /dashboard/deliveries/count
    // Pour l'instant, retourne 0
    return {
      count: 0,
      start_date: startDate || null,
      end_date: endDate || null,
    };
  },
};


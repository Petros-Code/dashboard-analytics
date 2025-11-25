import api from './api';

export interface OrdersCountResponse {
  count: number;
  start_date: string | null;
  end_date: string | null;
  marketplace_id?: number | null;
  country_id?: number | null;
}

export interface DeliveriesCountResponse {
  count: number;
  start_date: string | null;
  end_date: string | null;
  marketplace_id?: number | null;
  country_id?: number | null;
}

export interface RevenueTotalResponse {
  total: number;
  start_date: string | null;
  end_date: string | null;
  marketplace_id?: number | null;
  country_id?: number | null;
}

export interface NetMarginTotalResponse {
  total: number;
  start_date: string | null;
  end_date: string | null;
  marketplace_id?: number | null;
  country_id?: number | null;
}

export interface StockValueTotalResponse {
  total: number;
  start_date: string | null;
  end_date: string | null;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface ChartResponse {
  data: ChartDataPoint[];
  start_date: string | null;
  end_date: string | null;
  marketplace_id?: number | null;
  country_id?: number | null;
}

export interface Marketplace {
  id: number;
  name: string;
  commission_rate: number | null;
}

export interface Country {
  id: number;
  code: string;
  name: string;
}

export interface MarketplacesResponse {
  marketplaces: Marketplace[];
}

export interface CountriesResponse {
  countries: Country[];
}

/**
 * Construit les paramètres de requête pour les filtres
 */
const buildFilterParams = (
  startDate?: string, 
  endDate?: string, 
  marketplaceId?: number | null, 
  countryId?: number | null
): URLSearchParams => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (marketplaceId !== undefined && marketplaceId !== null) {
    params.append('marketplace_id', marketplaceId.toString());
  }
  if (countryId !== undefined && countryId !== null) {
    params.append('country_id', countryId.toString());
  }
  return params;
};

/**
 * Construit les paramètres de requête pour les dates uniquement
 */
const buildDateParams = (startDate?: string, endDate?: string): URLSearchParams => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  return params;
};

export const dashboardService = {
  getOrdersCount: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<OrdersCountResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<OrdersCountResponse>(`/dashboard/orders/count?${params.toString()}`);
    return response.data;
  },

  getDeliveriesCount: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<DeliveriesCountResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<DeliveriesCountResponse>(`/dashboard/deliveries/count?${params.toString()}`);
    return response.data;
  },

  getRevenueTotal: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<RevenueTotalResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<RevenueTotalResponse>(`/dashboard/revenue/total?${params.toString()}`);
    return response.data;
  },

  getNetMarginTotal: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<NetMarginTotalResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<NetMarginTotalResponse>(`/dashboard/net-margin/total?${params.toString()}`);
    return response.data;
  },

  getStockValueTotal: async (
    startDate?: string, 
    endDate?: string
  ): Promise<StockValueTotalResponse> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<StockValueTotalResponse>(`/dashboard/stock-value/total?${params.toString()}`);
    return response.data;
  },

  getMarketplaces: async (): Promise<MarketplacesResponse> => {
    const response = await api.get<MarketplacesResponse>('/dashboard/marketplaces');
    return response.data;
  },

  getCountries: async (): Promise<CountriesResponse> => {
    const response = await api.get<CountriesResponse>('/dashboard/countries');
    return response.data;
  },

  getSalesChart: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<ChartResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<ChartResponse>(`/dashboard/sales/chart?${params.toString()}`);
    return response.data;
  },

  getRevenueChart: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<ChartResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<ChartResponse>(`/dashboard/revenue/chart?${params.toString()}`);
    return response.data;
  },

  getNetMarginChart: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<ChartResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<ChartResponse>(`/dashboard/net-margin/chart?${params.toString()}`);
    return response.data;
  },

  getStockValueChart: async (startDate?: string, endDate?: string): Promise<ChartResponse> => {
    const params = buildFilterParams(startDate, endDate);
    const response = await api.get<ChartResponse>(`/dashboard/stock-value/chart?${params.toString()}`);
    return response.data;
  },

  getNewCustomersChart: async (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ): Promise<ChartResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<ChartResponse>(`/dashboard/new-customers/chart?${params.toString()}`);
    return response.data;
  },

  // Stocks endpoints
  getStocksOnlineCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>('/dashboard/stocks/online/count');
    return response.data;
  },

  getStocksDraftCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>('/dashboard/stocks/draft/count');
    return response.data;
  },

  getStocksAveragePurchasePrice: async (
    startDate?: string,
    endDate?: string
  ): Promise<{ total: number }> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<{ average_price: number; count: number; start_date: string | null; end_date: string | null }>(`/dashboard/stocks/average-purchase-price?${params.toString()}`);
    // Adapter pour useKPIData qui attend { count | total }
    return { total: response.data.average_price || 0 };
  },

  getStocksAverageDays: async (
    startDate?: string,
    endDate?: string
  ): Promise<{ total: number }> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<{ average_days: number; count: number; start_date: string | null; end_date: string | null }>(`/dashboard/stocks/average-days?${params.toString()}`);
    // Adapter pour useKPIData qui attend { count | total }
    return { total: response.data.average_days || 0 };
  },

  getPublishedProductsChart: async (
    startDate?: string,
    endDate?: string,
    periodType: 'day' | 'week' | 'month' | 'year' = 'day'
  ): Promise<ChartResponse & { period_type: string }> => {
    const params = buildDateParams(startDate, endDate);
    params.append('period_type', periodType);
    const response = await api.get(`/dashboard/stocks/published/chart?${params.toString()}`);
    return response.data;
  },

  getStockValueHTChart: async (
    startDate?: string,
    endDate?: string
  ): Promise<ChartResponse> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<ChartResponse>(`/dashboard/stocks/value-ht/chart?${params.toString()}`);
    return response.data;
  },

  getStockValuePurchaseChart: async (
    startDate?: string,
    endDate?: string
  ): Promise<ChartResponse> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<ChartResponse>(`/dashboard/stocks/value-purchase/chart?${params.toString()}`);
    return response.data;
  },

  getStockByCategoryChart: async (
    startDate?: string,
    endDate?: string
  ): Promise<{ data: { category: string; value: number }[]; start_date: string | null; end_date: string | null }> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get(`/dashboard/stocks/by-category/chart?${params.toString()}`);
    return response.data;
  },

  getAgingProducts: async (
    days: number
  ): Promise<{ products: Array<{ id: number; name: string; sku: string; category: string; purchase_price: number | null; selling_price_ht: number | null; selling_price_ttc: number | null; created_at: string; days_in_stock: number }>; days: number; count: number }> => {
    const response = await api.get(`/dashboard/stocks/aging-products?days=${days}`);
    return response.data;
  },

  // Marketing endpoints
  getInstagramFollowersChart: async (
    startDate?: string,
    endDate?: string
  ): Promise<ChartResponse> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<ChartResponse>(`/dashboard/marketing/instagram-followers/chart?${params.toString()}`);
    return response.data;
  },

  getTikTokFollowersChart: async (
    startDate?: string,
    endDate?: string
  ): Promise<ChartResponse> => {
    const params = buildDateParams(startDate, endDate);
    const response = await api.get<ChartResponse>(`/dashboard/marketing/tiktok-followers/chart?${params.toString()}`);
    return response.data;
  },

  getPromoCodeUsageChart: async (
    startDate?: string,
    endDate?: string,
    marketplaceId?: number | null,
    countryId?: number | null
  ): Promise<ChartResponse> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get<ChartResponse>(`/dashboard/marketing/promo-code-usage/chart?${params.toString()}`);
    return response.data;
  },

  getPromoCodes: async (): Promise<{ promo_codes: Array<{ id: number; code: string; discount_type: string; discount_value: number; is_active: boolean }> }> => {
    const response = await api.get('/dashboard/marketing/promo-codes');
    return response.data;
  },

  getPromoCodeOrdersChart: async (
    promoCodeId: number,
    startDate?: string,
    endDate?: string,
    marketplaceId?: number | null,
    countryId?: number | null
  ): Promise<ChartResponse & { promo_code_id: number }> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    params.append('promo_code_id', promoCodeId.toString());
    const response = await api.get(`/dashboard/marketing/promo-code-orders/chart?${params.toString()}`);
    return response.data;
  },

  getInstagramFollowersCurrent: async (): Promise<{ total: number }> => {
    const response = await api.get<{ followers: number; month: string }>('/dashboard/marketing/instagram-followers/current');
    // Adapter pour useKPIData qui attend { count | total }
    return { total: response.data.followers || 0 };
  },

  getTikTokFollowersCurrent: async (): Promise<{ total: number }> => {
    const response = await api.get<{ followers: number; month: string }>('/dashboard/marketing/tiktok-followers/current');
    // Adapter pour useKPIData qui attend { count | total }
    return { total: response.data.followers || 0 };
  },

  getPromoCodesTotalUsage: async (
    startDate?: string,
    endDate?: string,
    marketplaceId?: number | null,
    countryId?: number | null
  ): Promise<{ total: number; start_date: string | null; end_date: string | null; marketplace_id?: number | null; country_id?: number | null }> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get(`/dashboard/marketing/promo-codes/total-usage?${params.toString()}`);
    return response.data;
  },

  getPromoCodesMostUsed: async (
    startDate?: string,
    endDate?: string,
    marketplaceId?: number | null,
    countryId?: number | null
  ): Promise<{ code: string | null; id: number | null; usage_count: number; start_date: string | null; end_date: string | null; marketplace_id?: number | null; country_id?: number | null }> => {
    const params = buildFilterParams(startDate, endDate, marketplaceId, countryId);
    const response = await api.get(`/dashboard/marketing/promo-codes/most-used?${params.toString()}`);
    return response.data;
  },
};


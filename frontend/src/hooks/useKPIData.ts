import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

interface UseKPIDataResult {
  count: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook personnalisé pour récupérer les données d'un KPI
 * @param fetchFunction - Fonction de récupération des données
 * @param startDate - Date de début (optionnelle)
 * @param endDate - Date de fin (optionnelle)
 */
export const useKPIData = (
  fetchFunction: (startDate?: string, endDate?: string) => Promise<{ count: number }>,
  startDate?: string | null,
  endDate?: string | null
): UseKPIDataResult => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(
          startDate || undefined,
          endDate || undefined
        );
        setCount(response.count);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error fetching KPI data:', error);
        setError(error);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, startDate, endDate]);

  return { count, isLoading, error };
};


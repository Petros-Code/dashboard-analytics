import { useState, useEffect } from 'react';

interface UseKPIDataResult {
  value: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook personnalisé pour récupérer les données d'un KPI
 * @param fetchFunction - Fonction de récupération des données
 * @param startDate - Date de début (optionnelle)
 * @param endDate - Date de fin (optionnelle)
 * @param marketplaceId - ID de la marketplace (optionnelle)
 * @param countryId - ID du pays (optionnelle)
 */
export const useKPIData = (
  fetchFunction: (
    startDate?: string, 
    endDate?: string, 
    marketplaceId?: number | null, 
    countryId?: number | null
  ) => Promise<{ count?: number; total?: number }>,
  startDate?: string | null,
  endDate?: string | null,
  marketplaceId?: number | null,
  countryId?: number | null
): UseKPIDataResult => {
  const [value, setValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(
          startDate || undefined,
          endDate || undefined,
          marketplaceId !== undefined && marketplaceId !== null ? marketplaceId : undefined,
          countryId !== undefined && countryId !== null ? countryId : undefined
        );
        // Supporte à la fois 'count' et 'total' dans la réponse
        setValue(response.count ?? response.total ?? 0);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error fetching KPI data:', error);
        setError(error);
        setValue(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, startDate, endDate, marketplaceId, countryId]);

  return { value, isLoading, error };
};


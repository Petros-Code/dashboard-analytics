import React, { useState, useEffect } from 'react';
import { FilterDropdown } from './FilterDropdown';
import { FILTERS, CATEGORY_OPTIONS, GENDER_OPTIONS } from '../../constants/dashboard';
import { useFilters } from '../../contexts/FilterContext';
import { formatDateForDisplay, FRENCH_MONTHS } from '../../utils/dateUtils';
import { dashboardService, Marketplace, Country } from '../../services/dashboardService';

interface FilterBarProps {
  userName: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  userName 
}) => {
  const { 
    selectedPeriod, 
    selectedMarketplace, 
    selectedCountry,
    selectedCategory,
    selectedGender,
    setSelectedMarketplace,
    setSelectedCountry,
    setSelectedCategory,
    setSelectedGender
  } = useFilters();
  
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    period: '17 Sep 2025 - 26 Nov 2025',
    marketplace: '',
    country: '',
    category: '',
    gender: '',
  });

  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les marketplaces et pays au montage
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [marketplacesRes, countriesRes] = await Promise.all([
          dashboardService.getMarketplaces(),
          dashboardService.getCountries(),
        ]);
        setMarketplaces(marketplacesRes.marketplaces);
        setCountries(countriesRes.countries);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Synchroniser la période avec le contexte
  useEffect(() => {
    if (selectedPeriod?.startDate && selectedPeriod?.endDate) {
      const startDate = new Date(selectedPeriod.startDate);
      const endDate = new Date(selectedPeriod.endDate);
      const formatted = `${formatDateForDisplay(startDate, FRENCH_MONTHS)} - ${formatDateForDisplay(endDate, FRENCH_MONTHS)}`;
      setFilterValues((prev) => ({
        ...prev,
        period: formatted,
      }));
    }
  }, [selectedPeriod]);

  // Synchroniser les valeurs des filtres avec le contexte
  useEffect(() => {
    if (selectedMarketplace !== null) {
      const marketplace = marketplaces.find(m => m.id === selectedMarketplace);
      if (marketplace) {
        setFilterValues((prev) => ({
          ...prev,
          marketplace: marketplace.name,
        }));
      }
    } else {
      setFilterValues((prev) => ({
        ...prev,
        marketplace: '',
      }));
    }
  }, [selectedMarketplace, marketplaces]);

  useEffect(() => {
    if (selectedCountry !== null) {
      const country = countries.find(c => c.id === selectedCountry);
      if (country) {
        setFilterValues((prev) => ({
          ...prev,
          country: country.name,
        }));
      }
    } else {
      setFilterValues((prev) => ({
        ...prev,
        country: '',
      }));
    }
  }, [selectedCountry, countries]);

  useEffect(() => {
    if (selectedCategory !== null) {
      setFilterValues((prev) => ({
        ...prev,
        category: selectedCategory,
      }));
    } else {
      setFilterValues((prev) => ({
        ...prev,
        category: '',
      }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedGender !== null) {
      setFilterValues((prev) => ({
        ...prev,
        gender: selectedGender,
      }));
    } else {
      setFilterValues((prev) => ({
        ...prev,
        gender: '',
      }));
    }
  }, [selectedGender]);

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));

    // Mettre à jour le contexte selon le type de filtre
    if (filterId === 'marketplace') {
      if (value === '') {
        setSelectedMarketplace(null);
      } else {
        const marketplace = marketplaces.find(m => m.name === value);
        if (marketplace) {
          setSelectedMarketplace(marketplace.id);
        }
      }
    } else if (filterId === 'country') {
      if (value === '') {
        setSelectedCountry(null);
      } else {
        const country = countries.find(c => c.name === value);
        if (country) {
          setSelectedCountry(country.id);
        }
      }
    } else if (filterId === 'category') {
      if (value === '') {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(value);
      }
    } else if (filterId === 'gender') {
      if (value === '') {
        setSelectedGender(null);
      } else {
        setSelectedGender(value);
      }
    }
  };

  return (
    <div className="absolute left-0 top-[100px] w-[2200px] h-[100px] bg-white rounded-[10px] shadow-sm flex items-center px-6">
      <h2 className="font-['Lato'] font-medium text-[20px] leading-[28px] text-[#1D1D1D] flex flex-col justify-center flex-shrink-0 mr-8">
        <span>Bonjour {userName},</span>
        <span>bienvenue sur le Dashboard</span>
      </h2>

      <div className="flex-1 flex items-center justify-evenly h-[70px]">
        {FILTERS.map((filter) => {
          let options: string[] | undefined;
          if (filter.id === 'marketplace') {
            options = ['', ...marketplaces.map(m => m.name)]; // Ajouter option vide pour "Tous"
          } else if (filter.id === 'country') {
            options = ['', ...countries.map(c => c.name)]; // Ajouter option vide pour "Tous"
          } else if (filter.id === 'category') {
            options = ['', ...CATEGORY_OPTIONS]; // Ajouter option vide pour "Tous"
          } else if (filter.id === 'gender') {
            options = ['', ...GENDER_OPTIONS]; // Ajouter option vide pour "Tous"
          }

          return (
            <FilterDropdown
              key={filter.id}
              label={filter.label}
              value={filterValues[filter.id] || filter.value}
              icon={filter.icon}
              type={filter.id as 'period' | 'marketplace' | 'country' | 'category' | 'gender'}
              options={options}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            />
          );
        })}
      </div>
    </div>
  );
};


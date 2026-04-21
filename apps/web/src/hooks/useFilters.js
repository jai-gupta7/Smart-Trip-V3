
import { useState, useMemo } from 'react';

export const useFilters = (data, initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    ...initialFilters,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter(item => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          item.id,
          item.customer,
          item.location,
          item.deliveryLocation,
          item.vehicle,
          item.driver,
        ].filter(Boolean);

        const matchesSearch = searchableFields.some(field =>
          field.toLowerCase().includes(searchLower)
        );

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (item.status?.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // Custom filters
      for (const [key, value] of Object.entries(filters)) {
        if (key === 'search' || key === 'status') continue;
        if (value && value !== 'all' && item[key] !== value) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      ...initialFilters,
    });
  };

  return {
    filters,
    filteredData,
    updateFilter,
    resetFilters,
  };
};

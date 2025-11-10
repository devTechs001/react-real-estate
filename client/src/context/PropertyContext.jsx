import { createContext, useState } from 'react';

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    type: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    location: '',
  });

  const [sortBy, setSortBy] = useState('newest');

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      location: '',
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        filters,
        updateFilters,
        resetFilters,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
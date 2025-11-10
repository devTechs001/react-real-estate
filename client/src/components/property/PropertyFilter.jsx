import { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: [],
    location: '',
    ...initialFilters,
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    // Count active filters
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === 'amenities') return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: updatedAmenities });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const emptyFilters = {
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: [],
      location: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary relative"
      >
        <FaFilter className="mr-2" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <Select
                    value={filters.propertyType}
                    onChange={(e) => handleChange('propertyType', e.target.value)}
                    options={PROPERTY_TYPES}
                    placeholder="All Types"
                  />
                </div>

                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Listing Type</label>
                  <Select
                    value={filters.listingType}
                    onChange={(e) => handleChange('listingType', e.target.value)}
                    options={LISTING_TYPES}
                    placeholder="Buy or Rent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleChange('minPrice', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bedrooms: {filters.bedrooms || 'Any'}
                  </label>
                  <Slider
                    min={0}
                    max={10}
                    value={filters.bedrooms || 0}
                    onChange={(value) => handleChange('bedrooms', value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Any</span>
                    <span>10+</span>
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bathrooms: {filters.bathrooms || 'Any'}
                  </label>
                  <Slider
                    min={0}
                    max={6}
                    value={filters.bathrooms || 0}
                    onChange={(value) => handleChange('bathrooms', value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Any</span>
                    <span>6+</span>
                  </div>
                </div>

                {/* Area Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Area (sqft)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minArea}
                      onChange={(e) => handleChange('minArea', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxArea}
                      onChange={(e) => handleChange('maxArea', e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="City or Zip Code"
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {AMENITIES.map((amenity) => (
                      <Checkbox
                        key={amenity}
                        label={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
                <Button onClick={applyFilters} fullWidth>
                  Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
                <Button onClick={resetFilters} variant="secondary" fullWidth>
                  Reset All
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyFilter;
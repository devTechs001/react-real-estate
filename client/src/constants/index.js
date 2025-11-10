export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
];

export const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
];

export const AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Garden',
  'Balcony',
  'Security',
  'Elevator',
  'Air Conditioning',
  'Heating',
  'WiFi',
  'Pet Friendly',
  'Furnished',
];

export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Under $100K' },
  { min: 100000, max: 300000, label: '$100K - $300K' },
  { min: 300000, max: 500000, label: '$300K - $500K' },
  { min: 500000, max: 1000000, label: '$500K - $1M' },
  { min: 1000000, max: null, label: 'Over $1M' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];
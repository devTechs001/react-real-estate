// client/src/pages/Properties.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import '../styles/Properties.css';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState([]);
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'all',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    bedrooms: searchParams.get('bedrooms') || 'any',
    bathrooms: searchParams.get('bathrooms') || 'any',
    areaMin: searchParams.get('areaMin') || '',
    areaMax: searchParams.get('areaMax') || '',
    amenities: [],
    listingType: searchParams.get('listingType') || 'all'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 5,
    total: 124
  });

  // Mock properties data
  const mockProperties = [
    {
      id: 1,
      title: 'Luxury Waterfront Villa',
      price: 2500000,
      location: 'Miami Beach, FL',
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
      ],
      type: 'Villa',
      listingType: 'sale',
      featured: true,
      rating: 4.9,
      reviewCount: 45,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Modern Downtown Penthouse',
      price: 1800000,
      location: 'New York, NY',
      bedrooms: 3,
      bathrooms: 3,
      area: 2800,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
      type: 'Penthouse',
      listingType: 'sale',
      featured: false,
      rating: 4.8,
      reviewCount: 32
    },
    {
      id: 3,
      title: 'Cozy Studio Apartment',
      price: 1500,
      location: 'Austin, TX',
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      type: 'Apartment',
      listingType: 'rent',
      featured: false,
      rating: 4.5,
      reviewCount: 28
    },
    {
      id: 4,
      title: 'Beachfront Paradise Home',
      price: 3200000,
      location: 'Malibu, CA',
      bedrooms: 6,
      bathrooms: 5,
      area: 5500,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
      type: 'House',
      listingType: 'sale',
      featured: true,
      rating: 5.0,
      reviewCount: 18
    },
    {
      id: 5,
      title: 'Mountain View Cabin',
      price: 450000,
      location: 'Aspen, CO',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800'],
      type: 'Cabin',
      listingType: 'sale',
      featured: false,
      rating: 4.7,
      reviewCount: 56
    },
    {
      id: 6,
      title: 'Urban Loft with City Views',
      price: 2800,
      location: 'Chicago, IL',
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      type: 'Loft',
      listingType: 'rent',
      featured: false,
      rating: 4.6,
      reviewCount: 41
    },
  ];

  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy, pagination.page]);

  const fetchProperties = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setProperties(mockProperties);
    setLoading(false);
  };

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const propertyTypes = ['All', 'House', 'Apartment', 'Villa', 'Condo', 'Penthouse', 'Loft'];
  const amenitiesList = ['Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Security', 'AC', 'Furnished'];

  const PropertyCard = ({ property, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <Link to={`/properties/${property.id}`} className={viewMode === 'list' ? 'flex w-full' : ''}>
        {/* Image */}
        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 flex-shrink-0' : 'h-64'}`}>
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {property.featured && (
              <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                ⭐ Featured
              </span>
            )}
            <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>

          {/* Favorite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property.id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
              favorites.includes(property.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:text-red-500'
            }`}
          >
            <svg className="w-5 h-5" fill={favorites.includes(property.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Price */}
          <div className="absolute bottom-4 left-4">
            <span className="text-2xl font-bold text-white">
              {formatPrice(property.price, property.listingType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
            {property.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-400">⭐</span>
                <span className="font-medium">{property.rating}</span>
              </div>
            )}
          </div>

          <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
            📍 {property.location}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-600">
              <span>🛏️</span>
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span>🚿</span>
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span>📐</span>
              <span className="text-sm">{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <>
      <SEO title="Properties - HomeScape" description="Browse thousands of properties for sale and rent." />

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Search Header */}
        <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search location, city, or ZIP..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                    showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>

              {/* Sort & View */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>

                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-4 gap-4 pt-4 mt-4 border-t">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      >
                        {propertyTypes.map(type => (
                          <option key={type} value={type.toLowerCase()}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.priceMin}
                          onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.priceMax}
                          onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                      <div className="flex gap-1">
                        {['Any', '1', '2', '3', '4', '5+'].map(num => (
                          <button
                            key={num}
                            onClick={() => setFilters({ ...filters, bedrooms: num.toLowerCase() })}
                            className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                              filters.bedrooms === num.toLowerCase()
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Listing Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                      <div className="flex gap-2">
                        {['All', 'Sale', 'Rent'].map(type => (
                          <button
                            key={type}
                            onClick={() => setFilters({ ...filters, listingType: type.toLowerCase() })}
                            className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                              filters.listingType === type.toLowerCase()
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => {
                            const newAmenities = filters.amenities.includes(amenity)
                              ? filters.amenities.filter(a => a !== amenity)
                              : [...filters.amenities, amenity];
                            setFilters({ ...filters, amenities: newAmenities });
                          }}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                            filters.amenities.includes(amenity)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setFilters({
                        location: '',
                        type: 'all',
                        priceMin: '',
                        priceMax: '',
                        bedrooms: 'any',
                        bathrooms: 'any',
                        areaMin: '',
                        areaMax: '',
                        amenities: [],
                        listingType: 'all'
                      })}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Clear All
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pagination.total} Properties Found
                </h1>
                <p className="text-gray-600">
                  {filters.location || 'All locations'} • {filters.type !== 'all' ? filters.type : 'All types'}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Properties Grid */}
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {properties.map((property, index) => (
                    <PropertyCard key={property.id} property={property} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPagination({ ...pagination, page: i + 1 })}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          pagination.page === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default Properties;
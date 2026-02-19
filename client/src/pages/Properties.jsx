// client/src/pages/Properties.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/common/Header';
import SEO from '../components/common/SEO';
import '../styles/Properties.css';

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const scrollRef = useRef(null);

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
    listingType: searchParams.get('listingType') || 'all',
    furnished: false,
    petFriendly: false,
    parking: false,
    newConstruction: false,
    hasVirtualTour: false,
    verified: false,
    yearBuiltMin: '',
    yearBuiltMax: '',
  });

  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [areaRange, setAreaRange] = useState([0, 10000]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 8,
    total: 234,
    perPage: 12
  });

  const [stats, setStats] = useState({
    avgPrice: 1250000,
    totalListings: 234,
    newThisWeek: 18,
    priceChange: +5.2
  });

  // Enhanced Mock Properties Data
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
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
      ],
      type: 'Villa',
      listingType: 'sale',
      featured: true,
      verified: true,
      rating: 4.9,
      reviewCount: 45,
      createdAt: new Date('2024-01-15'),
      yearBuilt: 2020,
      parking: 3,
      furnished: true,
      petFriendly: false,
      hasVirtualTour: true,
      agent: {
        name: 'Sarah Johnson',
        image: 'https://i.pravatar.cc/150?img=1',
        phone: '+1 305 555 0123'
      },
      amenities: ['Pool', 'Gym', 'Security', 'Garden', 'Ocean View'],
      description: 'Stunning waterfront villa with panoramic ocean views...',
      daysOnMarket: 12,
      views: 1245,
      saved: 89
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
      featured: true,
      verified: true,
      rating: 4.8,
      reviewCount: 32,
      createdAt: new Date('2024-01-10'),
      yearBuilt: 2019,
      parking: 2,
      furnished: false,
      petFriendly: true,
      hasVirtualTour: true,
      agent: {
        name: 'Michael Chen',
        image: 'https://i.pravatar.cc/150?img=2',
        phone: '+1 212 555 0456'
      },
      amenities: ['Gym', 'Doorman', 'Rooftop', 'Storage'],
      description: 'Luxurious penthouse in the heart of Manhattan...',
      daysOnMarket: 8,
      views: 2341,
      saved: 156
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
      verified: false,
      rating: 4.5,
      reviewCount: 28,
      createdAt: new Date('2024-01-20'),
      yearBuilt: 2018,
      parking: 1,
      furnished: true,
      petFriendly: true,
      hasVirtualTour: false,
      agent: {
        name: 'Emily Davis',
        image: 'https://i.pravatar.cc/150?img=3',
        phone: '+1 512 555 0789'
      },
      amenities: ['AC', 'WiFi', 'Parking'],
      description: 'Perfect studio for young professionals...',
      daysOnMarket: 3,
      views: 567,
      saved: 23
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
      verified: true,
      rating: 5.0,
      reviewCount: 18,
      createdAt: new Date('2024-01-05'),
      yearBuilt: 2021,
      parking: 4,
      furnished: false,
      petFriendly: true,
      hasVirtualTour: true,
      agent: {
        name: 'David Wilson',
        image: 'https://i.pravatar.cc/150?img=4',
        phone: '+1 310 555 0234'
      },
      amenities: ['Pool', 'Beach Access', 'Wine Cellar', 'Home Theater'],
      description: 'Exclusive beachfront estate with private beach access...',
      daysOnMarket: 25,
      views: 3456,
      saved: 234
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
      verified: true,
      rating: 4.7,
      reviewCount: 56,
      createdAt: new Date('2024-01-12'),
      yearBuilt: 2015,
      parking: 2,
      furnished: true,
      petFriendly: true,
      hasVirtualTour: false,
      agent: {
        name: 'Rachel Green',
        image: 'https://i.pravatar.cc/150?img=5',
        phone: '+1 970 555 0567'
      },
      amenities: ['Fireplace', 'Mountain View', 'Hot Tub'],
      description: 'Charming mountain retreat with stunning views...',
      daysOnMarket: 15,
      views: 890,
      saved: 67
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
      verified: false,
      rating: 4.6,
      reviewCount: 41,
      createdAt: new Date('2024-01-18'),
      yearBuilt: 2017,
      parking: 1,
      furnished: false,
      petFriendly: false,
      hasVirtualTour: true,
      agent: {
        name: 'James Brown',
        image: 'https://i.pravatar.cc/150?img=6',
        phone: '+1 312 555 0890'
      },
      amenities: ['High Ceilings', 'Exposed Brick', 'City View'],
      description: 'Industrial-style loft in trendy neighborhood...',
      daysOnMarket: 5,
      views: 1123,
      saved: 45
    },
  ];

  const propertyTypes = ['All', 'House', 'Apartment', 'Villa', 'Condo', 'Penthouse', 'Loft', 'Cabin', 'Townhouse'];
  const amenitiesList = ['Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Security', 'AC', 'Furnished', 'WiFi', 'Elevator', 'Storage', 'Pet Friendly'];

  useEffect(() => {
    fetchProperties();
    loadFavorites();
    loadRecentlyViewed();
  }, [filters, sortBy, pagination.page]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.location) count++;
    if (filters.type !== 'all') count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.listingType !== 'all') count++;
    if (filters.furnished) count++;
    if (filters.petFriendly) count++;
    if (filters.hasVirtualTour) count++;
    if (filters.verified) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filtered = [...mockProperties];
    
    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type.toLowerCase() === filters.type);
    }
    
    if (filters.listingType !== 'all') {
      filtered = filtered.filter(p => p.listingType === filters.listingType);
    }
    
    if (filters.bedrooms !== 'any') {
      const beds = parseInt(filters.bedrooms);
      filtered = filtered.filter(p => p.bedrooms >= beds);
    }
    
    if (filters.hasVirtualTour) {
      filtered = filtered.filter(p => p.hasVirtualTour);
    }
    
    if (filters.verified) {
      filtered = filtered.filter(p => p.verified);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    setProperties(filtered);
    setLoading(false);
  };

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  };

  const loadRecentlyViewed = () => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed);
  };

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Show toast notification
    showToast(
      favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites',
      'success'
    );
  };

  const toggleCompare = (id) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(p => p !== id));
    } else {
      if (selectedProperties.length >= 3) {
        showToast('You can only compare up to 3 properties', 'warning');
        return;
      }
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  const openQuickView = (property) => {
    setQuickViewProperty(property);
    setShowQuickView(true);
  };

  const shareProperty = async (property) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.origin + `/properties/${property.id}`
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const showToast = (message, type = 'info') => {
    // Implement toast notification (you can use a library like react-hot-toast)
    console.log(`${type}: ${message}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setFilters({
      location: '',
      type: 'all',
      priceMin: '',
      priceMax: '',
      bedrooms: 'any',
      bathrooms: 'any',
      areaMin: '',
      areaMax: '',
      amenities: [],
      listingType: 'all',
      furnished: false,
      petFriendly: false,
      parking: false,
      newConstruction: false,
      hasVirtualTour: false,
      verified: false,
      yearBuiltMin: '',
      yearBuiltMax: '',
    });
    setPriceRange([0, 5000000]);
    setAreaRange([0, 10000]);
  };

  const saveSearch = () => {
    const searches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    const newSearch = {
      id: Date.now(),
      name: `Search ${searches.length + 1}`,
      filters: filters,
      date: new Date().toISOString()
    };
    searches.push(newSearch);
    localStorage.setItem('savedSearches', JSON.stringify(searches));
    showToast('Search saved successfully!', 'success');
  };

  const PropertyCard = ({ property, index }) => {
    const isInFavorites = favorites.includes(property.id);
    const isSelected = selectedProperties.includes(property.id);
    const isNew = (new Date() - property.createdAt) / (1000 * 60 * 60 * 24) < 7;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 ${
          viewMode === 'list' ? 'flex' : ''
        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-96 flex-shrink-0' : 'h-72'}`}>
          <Link to={`/properties/${property.id}`}>
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          </Link>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {property.featured && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </motion.span>
            )}
            
            {isNew && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                🆕 New
              </span>
            )}
            
            {property.verified && (
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}

            {property.hasVirtualTour && (
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full shadow-lg">
                🎥 Virtual Tour
              </span>
            )}
            
            <span className={`px-3 py-1 text-white text-xs font-medium rounded-full shadow-lg ${
              property.listingType === 'rent' ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}>
              {property.listingType === 'rent' ? '🏠 For Rent' : '💰 For Sale'}
            </span>
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property.id);
              }}
              className={`p-2.5 rounded-full transition-all shadow-lg backdrop-blur-sm ${
                isInFavorites
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:text-red-500'
              }`}
            >
              <svg className="w-5 h-5" fill={isInFavorites ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                shareProperty(property);
              }}
              className="p-2.5 rounded-full bg-white/90 text-gray-600 hover:text-blue-500 transition-all shadow-lg backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(property.id);
              }}
              className={`p-2.5 rounded-full transition-all shadow-lg backdrop-blur-sm ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:text-blue-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.button>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-3xl font-bold text-white drop-shadow-lg">
                {formatPrice(property.price, property.listingType)}
              </span>
              {property.listingType === 'sale' && (
                <span className="text-sm text-white/80">
                  ${Math.round(property.price / property.area)}/sqft
                </span>
              )}
            </motion.div>
          </div>

          {/* Quick View Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            onClick={(e) => {
              e.preventDefault();
              openQuickView(property);
            }}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            Quick View
          </motion.button>
        </div>

        {/* Content */}
        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <Link to={`/properties/${property.id}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {property.title}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </p>
              </div>
              
              {property.rating && (
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-sm">{property.rating}</span>
                  <span className="text-xs text-gray-500">({property.reviewCount})</span>
                </div>
              )}
            </div>

            {/* Property Type & Stats */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {property.type}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">
                Listed {property.daysOnMarket} days ago
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {property.views}
              </span>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🛏️</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bedrooms</p>
                  <p className="font-semibold text-sm">{property.bedrooms}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🚿</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-sm">{property.bathrooms}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📐</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Area</p>
                  <p className="font-semibold text-sm">{property.area.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {property.amenities.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Agent Info */}
            {property.agent && viewMode === 'list' && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={property.agent.image} 
                    alt={property.agent.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{property.agent.name}</p>
                    <p className="text-xs text-gray-500">Listing Agent</p>
                  </div>
                </div>
                <a 
                  href={`tel:${property.agent.phone}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact
                </a>
              </div>
            )}
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <SEO 
        title="Properties for Sale & Rent - HomeScape" 
        description="Browse thousands of verified properties. Find your dream home today." 
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />

        {/* Enhanced Search Header */}
        <section className="bg-white border-b sticky top-0 z-40 shadow-md">
          <div className="container mx-auto px-4 py-4">
            {/* Main Search Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Input Group */}
              <div className="flex-1 flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 max-w-2xl">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by location, city, ZIP code, or neighborhood..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                  {filters.location && (
                    <button
                      onClick={() => setFilters({ ...filters, location: '' })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative px-6 py-3.5 rounded-xl border-2 transition-all flex items-center gap-2 font-medium ${
                    showFilters 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="newest">🆕 Newest First</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💎 Price: High to Low</option>
                    <option value="popular">🔥 Most Popular</option>
                    <option value="rating">⭐ Highest Rated</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-all ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </motion.button>
                </div>

                {/* Map View Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMapView(!showMapView)}
                  className={`hidden lg:flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    showMapView
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map
                </motion.button>

                {/* Save Search */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveSearch}
                  className="hidden xl:flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white font-medium"
                  title="Save this search"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save Search
                </motion.button>
              </div>
            </div>

            {/* Expanded Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Property Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                        <div className="relative">
                          <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none bg-white cursor-pointer"
                          >
                            {propertyTypes.map(type => (
                              <option key={type} value={type.toLowerCase()}>{type}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceMin}
                            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceMax}
                            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                        <div className="grid grid-cols-6 gap-1">
                          {['Any', '1', '2', '3', '4', '5+'].map(num => (
                            <motion.button
                              key={num}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFilters({ ...filters, bedrooms: num.toLowerCase() })}
                              className={`py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                                filters.bedrooms === num.toLowerCase()
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              {num}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Listing Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Type</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['All', 'Sale', 'Rent'].map(type => (
                            <motion.button
                              key={type}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setFilters({ ...filters, listingType: type.toLowerCase() })}
                              className={`py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                                filters.listingType === type.toLowerCase()
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              {type}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Advanced Filters Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                      {[
                        { key: 'furnished', label: '🛋️ Furnished', icon: '🛋️' },
                        { key: 'petFriendly', label: '🐾 Pet Friendly', icon: '🐾' },
                        { key: 'hasVirtualTour', label: '🎥 Virtual Tour', icon: '🎥' },
                        { key: 'verified', label: '✅ Verified', icon: '✅' },
                        { key: 'parking', label: '🚗 Parking', icon: '🚗' },
                        { key: 'newConstruction', label: '🏗️ New Build', icon: '🏗️' },
                      ].map(filter => (
                        <motion.button
                          key={filter.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFilters({ ...filters, [filter.key]: !filters[filter.key] })}
                          className={`py-2.5 px-3 text-sm font-medium rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            filters[filter.key]
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <span>{filter.icon}</span>
                          <span className="hidden lg:inline">{filter.label.split(' ')[1]}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {amenitiesList.map(amenity => (
                          <motion.button
                            key={amenity}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const newAmenities = filters.amenities.includes(amenity)
                                ? filters.amenities.filter(a => a !== amenity)
                                : [...filters.amenities, amenity];
                              setFilters({ ...filters, amenities: newAmenities });
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all ${
                              filters.amenities.includes(amenity)
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {amenity}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear All Filters
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowFilters(false)}
                          className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            fetchProperties();
                            setShowFilters(false);
                          }}
                          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Apply Filters
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters Chips */}
            {activeFiltersCount > 0 && !showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-200"
              >
                <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                {filters.location && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    📍 {filters.location}
                    <button onClick={() => setFilters({ ...filters, location: '' })}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.type !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    🏠 {filters.type}
                    <button onClick={() => setFilters({ ...filters, type: 'all' })}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.amenities.map(amenity => (
                  <span key={amenity} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    {amenity}
                    <button onClick={() => setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity) })}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Clear All
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-3xl font-bold">{pagination.total}</p>
                <p className="text-blue-100 text-sm mt-1">Total Properties</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold">{formatPrice(stats.avgPrice, 'sale')}</p>
                <p className="text-blue-100 text-sm mt-1">Average Price</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-3xl font-bold">+{stats.newThisWeek}</p>
                <p className="text-blue-100 text-sm mt-1">New This Week</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-3xl font-bold flex items-center justify-center gap-1">
                  {stats.priceChange > 0 ? '📈' : '📉'} {Math.abs(stats.priceChange)}%
                </p>
                <p className="text-blue-100 text-sm mt-1">Price Change</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                >
                  {properties.length} Properties Found
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 flex items-center gap-2 flex-wrap"
                >
                  <span className="font-medium">{filters.location || 'All locations'}</span>
                  <span>•</span>
                  <span>{filters.type !== 'all' ? filters.type : 'All types'}</span>
                  <span>•</span>
                  <span>{filters.listingType !== 'all' ? `For ${filters.listingType}` : 'All listings'}</span>
                </motion.p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4">
                {favorites.length > 0 && (
                  <Link 
                    to="/favorites"
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{favorites.length} Saved</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-72 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" style={{ backgroundSize: '200% 100%' }} />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Properties Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Properties Grid */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-8 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}
                  >
                    {properties.map((property, index) => (
                      <PropertyCard key={property.id} property={property} index={index} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Enhanced Pagination */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center gap-6 mt-16"
                >
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                      disabled={pagination.page === 1}
                      className="p-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    
                    <div className="flex gap-2">
                      {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPagination({ ...pagination, page: pageNum })}
                            className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                              pagination.page === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                                : 'border-2 border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                      {pagination.totalPages > 7 && (
                        <>
                          <span className="flex items-center px-2 text-gray-400">...</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPagination({ ...pagination, page: pagination.totalPages })}
                            className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white font-semibold"
                          >
                            {pagination.totalPages}
                          </motion.button>
                        </>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.perPage) + 1} - {Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total} properties
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-30">
          {/* Compare Button */}
          <AnimatePresence>
            {selectedProperties.length > 0 && (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCompare(true)}
                className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-2xl shadow-purple-300 flex items-center justify-center"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {selectedProperties.length}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scroll to Top */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl shadow-blue-300 flex items-center justify-center"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && quickViewProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            >
              <div className="relative">
                <img 
                  src={quickViewProperty.image} 
                  alt={quickViewProperty.title}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{quickViewProperty.title}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {quickViewProperty.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-blue-600">
                      {formatPrice(quickViewProperty.price, quickViewProperty.listingType)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ${Math.round(quickViewProperty.price / quickViewProperty.area)}/sqft
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200 my-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{quickViewProperty.bedrooms}</p>
                    <p className="text-sm text-gray-600 mt-1">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{quickViewProperty.bathrooms}</p>
                    <p className="text-sm text-gray-600 mt-1">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{quickViewProperty.area.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">Sq Ft</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{quickViewProperty.description}</p>

                <div className="flex gap-3">
                  <Link
                    to={`/properties/${quickViewProperty.id}`}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all"
                  >
                    View Full Details
                  </Link>
                  <button
                    onClick={() => {
                      toggleFavorite(quickViewProperty.id);
                      setShowQuickView(false);
                    }}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    {favorites.includes(quickViewProperty.id) ? '❤️ Saved' : '🤍 Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Properties;
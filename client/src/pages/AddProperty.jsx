// client/src/pages/AddProperty.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCamera,
  FaVideo,
  FaCube,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaTrash,
  FaEdit,
  FaSave,
  FaEye,
  FaUpload,
  FaFile,
  FaFilePdf,
  FaBed,
  FaBath,
  FaCar,
  FaRuler,
  FaCalendar,
  FaThermometerHalf,
  FaSnowflake,
  FaBolt,
  FaWater,
  FaWifi,
  FaTv,
  FaSwimmingPool,
  FaDumbbell,
  FaTree,
  FaShieldAlt,
  FaElevator,
  FaWheelchair,
  FaDog,
  FaSmoking,
  FaParking,
  FaWarehouse,
  FaCouch,
  FaUtensils,
  FaLock,
  FaKey,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaChartLine,
  FaLightbulb,
  FaMagic,
  FaRobot,
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaClipboardCheck,
  FaClipboard,
  FaPercentage,
  FaHandshake,
  FaStar,
  FaTrophy,
  FaAward,
  FaMedal,
  FaGift,
  FaRocket,
  FaFire,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import PropertyForm from '@/components/forms/PropertyForm';
import SEO from '@/components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    propertyType: '',
    listingType: 'sale',
    status: 'active',
    featured: false,
    verified: false,
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    neighborhood: '',
    coordinates: { lat: null, lng: null },
    
    // Property Details
    bedrooms: 0,
    bathrooms: 0,
    halfBathrooms: 0,
    area: 0,
    lotSize: 0,
    yearBuilt: '',
    stories: 1,
    parking: 0,
    garageSpaces: 0,
    
    // Pricing
    price: 0,
    pricePerSqft: 0,
    previousPrice: 0,
    taxAssessedValue: 0,
    annualPropertyTax: 0,
    hoaFee: 0,
    hoaFrequency: 'monthly',
    
    // Features & Amenities
    interiorFeatures: [],
    exteriorFeatures: [],
    communityAmenities: [],
    appliances: [],
    flooring: [],
    heating: '',
    cooling: '',
    utilities: [],
    
    // Media
    images: [],
    virtualTourUrl: '',
    videoUrl: '',
    floorPlanUrl: '',
    documents: [],
    
    // Additional Details
    petPolicy: '',
    smokingPolicy: '',
    furnished: false,
    availableDate: '',
    leaseDuration: '',
    securityDeposit: 0,
    
    // Marketing
    marketingTitle: '',
    marketingDescription: '',
    highlights: [],
    keywords: [],
    targetAudience: [],
    
    // Open House
    openHouses: [],
    
    // Contact
    showAgentContact: true,
    agentNotes: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    slug: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [comparableProperties, setComparableProperties] = useState([]);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [marketTrends, setMarketTrends] = useState(null);
  const fileInputRef = useRef(null);

  const steps = [
    { id: 1, title: 'Property Type', icon: FaHome, description: 'Basic property information' },
    { id: 2, title: 'Location', icon: FaMapMarkerAlt, description: 'Property address and map' },
    { id: 3, title: 'Details', icon: FaClipboard, description: 'Rooms, size, and year' },
    { id: 4, title: 'Features', icon: FaStar, description: 'Amenities and features' },
    { id: 5, title: 'Media', icon: FaCamera, description: 'Photos, videos, and tours' },
    { id: 6, title: 'Pricing', icon: FaDollarSign, description: 'Price and financial details' },
    { id: 7, title: 'Marketing', icon: FaRocket, description: 'Listing description and SEO' },
    { id: 8, title: 'Review', icon: FaCheckCircle, description: 'Review and publish' }
  ];

  const propertyTypes = [
    { value: 'house', label: 'House', icon: '🏠', description: 'Single-family home' },
    { value: 'apartment', label: 'Apartment', icon: '🏢', description: 'Unit in a building' },
    { value: 'condo', label: 'Condo', icon: '🏙️', description: 'Condominium unit' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️', description: 'Multi-floor unit' },
    { value: 'villa', label: 'Villa', icon: '🏰', description: 'Luxury property' },
    { value: 'penthouse', label: 'Penthouse', icon: '🌆', description: 'Top floor luxury' },
    { value: 'studio', label: 'Studio', icon: '🛋️', description: 'Open plan unit' },
    { value: 'loft', label: 'Loft', icon: '🏭', description: 'Industrial style' },
    { value: 'land', label: 'Land', icon: '🌍', description: 'Vacant land' },
    { value: 'commercial', label: 'Commercial', icon: '🏪', description: 'Business property' }
  ];

  const features = {
    interior: [
      'Hardwood Floors', 'Carpet', 'Tile Floors', 'Laminate',
      'Fireplace', 'Skylights', 'High Ceilings', 'Crown Molding',
      'Walk-in Closet', 'Pantry', 'Kitchen Island', 'Granite Countertops',
      'Stainless Steel Appliances', 'Smart Home', 'Central Vacuum',
      'Wet Bar', 'Wine Cellar', 'Home Office', 'Library',
      'Media Room', 'Game Room', 'Workshop', 'Storage Room'
    ],
    exterior: [
      'Pool', 'Hot Tub', 'Patio', 'Deck', 'Balcony', 'Garden',
      'Lawn', 'Sprinkler System', 'Outdoor Kitchen', 'BBQ Area',
      'Fire Pit', 'Playground', 'Tennis Court', 'Basketball Court',
      'RV Parking', 'Boat Parking', 'Greenhouse', 'Shed',
      'Fence', 'Gate', 'Security System', 'Solar Panels'
    ],
    community: [
      'Gym/Fitness Center', 'Swimming Pool', 'Clubhouse', 'Golf Course',
      'Tennis Courts', 'Playground', 'Park', 'Walking Trails',
      'Bike Paths', 'Dog Park', 'Security', 'Gated Community',
      'Concierge', 'Doorman', 'Elevator', 'Parking Garage',
      'Storage Units', 'Business Center', 'Conference Room',
      'Rooftop Terrace', 'BBQ/Picnic Area', 'Water Access'
    ],
    appliances: [
      'Refrigerator', 'Stove', 'Oven', 'Microwave', 'Dishwasher',
      'Washer', 'Dryer', 'Garbage Disposal', 'Trash Compactor',
      'Ice Maker', 'Wine Cooler', 'Range Hood', 'Double Oven',
      'Steam Oven', 'Warming Drawer', 'Coffee System', 'Water Filtration'
    ]
  };

  useEffect(() => {
    // Load draft if exists
    loadDraft();
    
    // Check for duplicate from location state
    if (location.state?.duplicate) {
      const duplicate = location.state.duplicate;
      setFormData({
        ...formData,
        ...duplicate,
        title: `Copy of ${duplicate.title}`,
        images: [],
        documents: []
      });
    }

    // Auto-save timer
    const autoSaveTimer = setInterval(() => {
      if (autoSaveEnabled) {
        saveDraft();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, []);

  const loadDraft = () => {
    const draft = localStorage.getItem('propertyDraft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setFormData(parsed.formData);
      setCompletedSteps(parsed.completedSteps || []);
      toast.success('Draft loaded', { icon: '📝' });
    }
  };

  const saveDraft = () => {
    const draft = {
      formData,
      completedSteps,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('propertyDraft', JSON.stringify(draft));
    setLastSaved(new Date());
  };

  const deleteDraft = () => {
    localStorage.removeItem('propertyDraft');
    toast.success('Draft deleted', { icon: '🗑️' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Auto-calculate price per sqft
    if (field === 'price' || field === 'area') {
      const price = field === 'price' ? value : formData.price;
      const area = field === 'area' ? value : formData.area;
      if (price && area) {
        setFormData(prev => ({
          ...prev,
          pricePerSqft: Math.round(price / area)
        }));
      }
    }

    // Generate slug from title
    if (field === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({
        ...prev,
        slug,
        metaTitle: value.substring(0, 60),
        marketingTitle: value
      }));
    }
  };

  const handleFeatureToggle = (category, feature) => {
    const fieldMap = {
      interior: 'interiorFeatures',
      exterior: 'exteriorFeatures',
      community: 'communityAmenities',
      appliances: 'appliances'
    };
    
    const field = fieldMap[category];
    const currentFeatures = formData[field] || [];
    
    if (currentFeatures.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        [field]: currentFeatures.filter(f => f !== feature)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentFeatures, feature]
      }));
    }
  };

  const handleImageUpload = async (files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        continue;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          isPrimary: formData.images.length === 0
        };
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
      };
      reader.readAsDataURL(file);
      
      // Simulate upload progress
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min((prev[file.name] || 0) + 10, 100)
        }));
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 1000);
    }
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const setPrimaryImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    }));
  };

  const validateStep = (stepId) => {
    const stepErrors = {};
    
    switch (stepId) {
      case 1:
        if (!formData.propertyType) stepErrors.propertyType = 'Property type is required';
        if (!formData.listingType) stepErrors.listingType = 'Listing type is required';
        break;
      case 2:
        if (!formData.address) stepErrors.address = 'Address is required';
        if (!formData.city) stepErrors.city = 'City is required';
        if (!formData.state) stepErrors.state = 'State is required';
        if (!formData.zipCode) stepErrors.zipCode = 'ZIP code is required';
        break;
      case 3:
        if (formData.bedrooms < 0) stepErrors.bedrooms = 'Bedrooms must be 0 or more';
        if (formData.bathrooms < 0) stepErrors.bathrooms = 'Bathrooms must be 0 or more';
        if (formData.area <= 0) stepErrors.area = 'Area must be greater than 0';
        break;
      case 5:
        if (formData.images.length === 0) stepErrors.images = 'At least one image is required';
        break;
      case 6:
        if (formData.price <= 0) stepErrors.price = 'Price must be greater than 0';
        break;
      case 7:
        if (!formData.title) stepErrors.title = 'Title is required';
        if (!formData.description) stepErrors.description = 'Description is required';
        if (formData.description.length < 100) stepErrors.description = 'Description must be at least 100 characters';
        break;
    }
    
    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error('Please fix the errors before proceeding');
      return;
    }
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (stepId) => {
    // Only allow navigation to completed steps or the next step
    if (stepId <= completedSteps.length + 1) {
      setCurrentStep(stepId);
    }
  };

  const fetchPriceEstimate = async () => {
    // Simulate AI price estimation
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const basePrice = formData.area * 250; // $250 per sqft average
    const bedroomBonus = formData.bedrooms * 15000;
    const bathroomBonus = formData.bathrooms * 10000;
    
    const features = [
      ...formData.interiorFeatures,
      ...formData.exteriorFeatures,
      ...formData.communityAmenities
    ];
    const featureBonus = features.length * 5000;
    
    const estimate = basePrice + bedroomBonus + bathroomBonus + featureBonus;
    const range = {
      min: estimate * 0.9,
      max: estimate * 1.1
    };
    
    setPriceEstimate({
      estimate,
      range,
      confidence: 85,
      comparables: 12
    });
    
    toast.success('Price estimate generated!', { icon: '💰' });
    setIsSubmitting(false);
  };

  const generateDescription = () => {
    // AI-powered description generation
    const features = [
      ...formData.interiorFeatures.slice(0, 3),
      ...formData.exteriorFeatures.slice(0, 2)
    ];
    
    const description = `Welcome to this stunning ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom ${formData.propertyType} located in the heart of ${formData.city}, ${formData.state}. 

This ${formData.area} square foot property features ${features.join(', ').toLowerCase()}, and so much more. 

Built in ${formData.yearBuilt}, this home combines modern amenities with classic charm. The property sits on a ${formData.lotSize} acre lot in the desirable ${formData.neighborhood || formData.city} neighborhood.

${formData.listingType === 'rent' ? `Available for immediate occupancy with a monthly rent of $${formData.price}.` : `Offered at $${formData.price}, this property represents excellent value in today's market.`}

Don't miss this opportunity to own this exceptional property. Schedule your private showing today!`;
    
    setFormData(prev => ({
      ...prev,
      description,
      marketingDescription: description
    }));
    
    toast.success('Description generated!', { icon: '✨' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate all steps
      let allErrors = {};
      for (let i = 1; i <= 7; i++) {
        const stepErrors = validateStep(i);
        allErrors = { ...allErrors, ...stepErrors };
      }
      
      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        toast.error('Please complete all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft
      deleteDraft();
      
      // Success
      toast.success('Property listed successfully!', {
        icon: '🎉',
        duration: 5000
      });
      
      // Redirect to property page
      navigate('/seller/properties/new-property-id');
    } catch (error) {
      toast.error('Failed to list property');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <StepPropertyType />;
      case 2:
        return <StepLocation />;
      case 3:
        return <StepDetails />;
      case 4:
        return <StepFeatures />;
      case 5:
        return <StepMedia />;
      case 6:
        return <StepPricing />;
      case 7:
        return <StepMarketing />;
      case 8:
        return <StepReview />;
      default:
        return null;
    }
  };

  // Step Components
  const StepPropertyType = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Type & Listing</h2>
        
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Select Property Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {propertyTypes.map((type) => (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('propertyType', type.value)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  formData.propertyType === type.value
                    ? 'bg-blue-50 border-blue-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-3">{type.icon}</div>
                <div className="font-semibold text-gray-900">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </motion.button>
            ))}
          </div>
          {errors.propertyType && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationCircle />
              {errors.propertyType}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Listing Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'sale', label: 'For Sale', icon: FaDollarSign, color: 'green' },
                { value: 'rent', label: 'For Rent', icon: FaKey, color: 'blue' }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('listingType', option.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.listingType === option.value
                        ? `bg-${option.color}-50 border-${option.color}-500`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`text-3xl mb-3 text-${option.color}-600`} />
                    <div className="font-semibold text-gray-900">{option.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Property Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="under_contract">Under Contract</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <label className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
            />
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-600 text-xl" />
              <div>
                <div className="font-semibold text-gray-900">Featured Listing</div>
                <div className="text-xs text-gray-600">Get premium placement</div>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.verified}
              onChange={(e) => handleInputChange('verified', e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600 text-xl" />
              <div>
                <div className="font-semibold text-gray-900">Verified Listing</div>
                <div className="text-xs text-gray-600">Property details confirmed</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* AI Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-300">
        <div className="flex items-start gap-4">
          <FaLightbulb className="text-3xl text-purple-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Pro Tips</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Properties listed as "Featured" get 3x more views</li>
              <li>• Verified listings have 45% higher conversion rates</li>
              <li>• {formData.propertyType ? `${formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)}s` : 'Properties'} are in high demand in your area</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const StepLocation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Location</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Main Street"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.address ? 'border-red-500' : 'border-gray-200'
            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationCircle />
              {errors.address}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Miami"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.city ? 'border-red-500' : 'border-gray-200'
            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State *
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.state ? 'border-red-500' : 'border-gray-200'
            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
          >
            <option value="">Select State</option>
            <option value="FL">Florida</option>
            <option value="NY">New York</option>
            <option value="CA">California</option>
            <option value="TX">Texas</option>
            {/* Add more states */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="33139"
            maxLength="5"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.zipCode ? 'border-red-500' : 'border-gray-200'
            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Neighborhood
          </label>
          <input
            type="text"
            value={formData.neighborhood}
            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            placeholder="South Beach"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Map */}
      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Pin Location on Map
        </label>
        <div className="h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <FaMapMarkerAlt className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Interactive map will be displayed here</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Set Location
            </button>
          </div>
        </div>
      </div>

      {/* Nearby Places */}
      <div className="bg-blue-50 p-6 rounded-2xl">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaMapMarked className="text-blue-600" />
          What's Nearby
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Help buyers understand the neighborhood
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Schools', icon: '🎓', count: 5 },
            { label: 'Restaurants', icon: '🍽️', count: 23 },
            { label: 'Shopping', icon: '🛍️', count: 12 },
            { label: 'Parks', icon: '🌳', count: 3 }
          ].map((item) => (
            <div key={item.label} className="bg-white p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
              <div className="font-bold text-gray-900">{item.count} nearby</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const StepDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>

      {/* Room Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rooms & Spaces</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bedrooms *
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleInputChange('bedrooms', Math.max(0, formData.bedrooms - 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                className="w-20 text-center px-2 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                min="0"
              />
              <button
                onClick={() => handleInputChange('bedrooms', formData.bedrooms + 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Baths *
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleInputChange('bathrooms', Math.max(0, formData.bathrooms - 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                className="w-20 text-center px-2 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                min="0"
              />
              <button
                onClick={() => handleInputChange('bathrooms', formData.bathrooms + 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Half Baths
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleInputChange('halfBathrooms', Math.max(0, formData.halfBathrooms - 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={formData.halfBathrooms}
                onChange={(e) => handleInputChange('halfBathrooms', parseInt(e.target.value) || 0)}
                className="w-20 text-center px-2 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                min="0"
              />
              <button
                onClick={() => handleInputChange('halfBathrooms', formData.halfBathrooms + 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Parking Spaces
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleInputChange('parking', Math.max(0, formData.parking - 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={formData.parking}
                onChange={(e) => handleInputChange('parking', parseInt(e.target.value) || 0)}
                className="w-20 text-center px-2 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                min="0"
              />
              <button
                onClick={() => handleInputChange('parking', formData.parking + 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Size & Structure */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Size & Structure</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Living Area (sq ft) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                placeholder="2500"
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                  errors.area ? 'border-red-500' : 'border-gray-200'
                } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                sq ft
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lot Size (acres)
            </label>
            <input
              type="number"
              value={formData.lotSize}
              onChange={(e) => handleInputChange('lotSize', parseFloat(e.target.value) || 0)}
              placeholder="0.25"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year Built *
            </label>
            <input
              type="number"
              value={formData.yearBuilt}
              onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stories
            </label>
            <select
              value={formData.stories}
              onChange={(e) => handleInputChange('stories', parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="1">1 Story</option>
              <option value="2">2 Stories</option>
              <option value="3">3 Stories</option>
              <option value="4">4+ Stories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Garage Spaces
            </label>
            <input
              type="number"
              value={formData.garageSpaces}
              onChange={(e) => handleInputChange('garageSpaces', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
        <h3 className="font-bold text-gray-900 mb-4">Property Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl text-center">
            <FaBed className="text-3xl text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{formData.bedrooms}</div>
            <div className="text-sm text-gray-600">Bedrooms</div>
          </div>
          <div className="bg-white p-4 rounded-xl text-center">
            <FaBath className="text-3xl text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {formData.bathrooms + formData.halfBathrooms * 0.5}
            </div>
            <div className="text-sm text-gray-600">Bathrooms</div>
          </div>
          <div className="bg-white p-4 rounded-xl text-center">
            <FaRuler className="text-3xl text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{formData.area || 0}</div>
            <div className="text-sm text-gray-600">Sq Ft</div>
          </div>
          <div className="bg-white p-4 rounded-xl text-center">
            <FaCar className="text-3xl text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{formData.parking}</div>
            <div className="text-sm text-gray-600">Parking</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Continue with remaining step components...
  // StepFeatures, StepMedia, StepPricing, StepMarketing, StepReview

  return (
    <>
      <SEO title="Add Property - HomeScape" description="List your property for sale or rent" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <FaArrowLeft />
                Back
              </button>

              <div className="flex items-center gap-4">
                {/* Auto-save indicator */}
                {autoSaveEnabled && lastSaved && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaClock />
                    Saved {new Date(lastSaved).toLocaleTimeString()}
                  </div>
                )}

                {/* Save Draft */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveDraft}
                  className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 font-medium flex items-center gap-2"
                >
                  <FaSave />
                  Save Draft
                </motion.button>

                {/* Preview */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 font-medium flex items-center gap-2"
                >
                  <FaEye />
                  Preview
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.id);
                  const isActive = currentStep === step.id;
                  const isClickable = step.id <= completedSteps.length + 1;

                  return (
                    <button
                      key={step.id}
                      onClick={() => isClickable && handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`flex flex-col items-center py-4 ${
                        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                      }`}
                    >
                      <motion.div
                        whileHover={isClickable ? { scale: 1.1 } : {}}
                        whileTap={isClickable ? { scale: 0.95 } : {}}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <FaCheck /> : <Icon />}
                      </motion.div>
                      <span className={`text-xs mt-2 font-medium hidden md:block ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Current Step */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <CurrentStepComponent />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaArrowLeft />
              Previous
            </motion.button>

            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step.id === currentStep
                      ? 'w-8 bg-blue-600'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                Next
                <FaArrowRight />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Publish Property
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProperty;
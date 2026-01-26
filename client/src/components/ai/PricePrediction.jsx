import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartLine,
  FaHome,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaCar,
  FaSwimmingPool,
  FaTree,
  FaDumbbell,
  FaShieldAlt,
  FaWifi,
  FaFire,
  FaSnowflake,
  FaInfoCircle,
  FaHistory,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import { MdKitchen, MdBalcony, MdElevator, MdPets } from 'react-icons/md';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import {
  Line as ChartLine,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const PricePrediction = () => {
  const [formData, setFormData] = useState({
    propertyType: 'house',
    location: '',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    yearBuilt: new Date().getFullYear() - 10,
    condition: 'good',
    parkingSpaces: 2,
    floor: 1,
    totalFloors: 1,
    amenities: [],
    nearbyFacilities: [],
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [marketTrends, setMarketTrends] = useState(null);
  const [comparables, setComparables] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const amenitiesList = [
    { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool },
    { id: 'garage', label: 'Garage', icon: FaCar },
    { id: 'garden', label: 'Garden', icon: FaTree },
    { id: 'gym', label: 'Gym', icon: FaDumbbell },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'wifi', label: 'High-Speed WiFi', icon: FaWifi },
    { id: 'fireplace', label: 'Fireplace', icon: FaFire },
    { id: 'ac', label: 'Air Conditioning', icon: FaSnowflake },
    { id: 'kitchen', label: 'Modern Kitchen', icon: MdKitchen },
    { id: 'balcony', label: 'Balcony', icon: MdBalcony },
    { id: 'elevator', label: 'Elevator', icon: MdElevator },
    { id: 'petFriendly', label: 'Pet Friendly', icon: MdPets },
  ];

  const nearbyFacilitiesList = [
    'Schools', 'Hospitals', 'Shopping Centers', 'Public Transport',
    'Parks', 'Restaurants', 'Banks', 'Airport', 'Highway Access'
  ];

  useEffect(() => {
    // Load prediction history from localStorage
    const savedHistory = localStorage.getItem('predictionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const toggleAmenity = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const toggleFacility = (facility) => {
    setFormData((prev) => ({
      ...prev,
      nearbyFacilities: prev.nearbyFacilities.includes(facility)
        ? prev.nearbyFacilities.filter((f) => f !== facility)
        : [...prev.nearbyFacilities, facility],
    }));
  };

  const validateForm = () => {
    if (!formData.location) {
      toast.error('Please enter a location');
      return false;
    }
    if (formData.area < 100) {
      toast.error('Area must be at least 100 sqft');
      return false;
    }
    if (formData.bedrooms < 1) {
      toast.error('Please enter valid number of bedrooms');
      return false;
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await aiService.predictPrice(formData);
      
      // Mock market trends data
      const mockTrends = generateMockMarketTrends();
      const mockComparables = generateMockComparables(response.prediction.predictedPrice);
      
      setPrediction(response.prediction);
      setMarketTrends(mockTrends);
      setComparables(mockComparables);
      
      // Save to history
      const newHistory = [
        {
          id: Date.now(),
          date: new Date().toISOString(),
          location: formData.location,
          price: response.prediction.predictedPrice,
          ...formData
        },
        ...history
      ].slice(0, 10); // Keep last 10 predictions
      
      setHistory(newHistory);
      localStorage.setItem('predictionHistory', JSON.stringify(newHistory));
      
      toast.success('Price prediction generated successfully!');
    } catch (error) {
      toast.error('Failed to predict price. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockMarketTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      price: Math.floor(Math.random() * 50000) + 450000,
      volume: Math.floor(Math.random() * 100) + 50,
    }));
  };

  const generateMockComparables = (basePrice) => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      address: `${Math.floor(Math.random() * 999) + 100} Main St`,
      price: basePrice + (Math.random() - 0.5) * 100000,
      beds: Math.floor(Math.random() * 2) + 3,
      baths: Math.floor(Math.random() * 2) + 2,
      area: Math.floor(Math.random() * 500) + 1300,
      soldDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const exportPrediction = () => {
    if (!prediction) return;
    
    const data = {
      prediction,
      formData,
      marketTrends,
      comparables,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-prediction-${Date.now()}.json`;
    a.click();
    
    toast.success('Prediction exported successfully!');
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-4 shadow-lg">
          <FaChartLine className="text-4xl text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          AI Price Prediction
        </h1>
        <p className="text-gray-600 text-lg">
          Get accurate property valuations powered by advanced AI
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              {['details', 'amenities', 'location'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaHome className="inline mr-2" />
                        Property Type
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="studio">Studio</option>
                        <option value="penthouse">Penthouse</option>
                      </select>
                    </div>

                    {/* Bedrooms and Bathrooms */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaBed className="inline mr-2" />
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaBath className="inline mr-2" />
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          step="0.5"
                          className="input"
                        />
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaRulerCombined className="inline mr-2" />
                        Area (sqft)
                      </label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        min="100"
                        max="10000"
                        className="input"
                      />
                    </div>

                    {/* Year Built and Condition */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Year Built
                        </label>
                        <input
                          type="number"
                          name="yearBuilt"
                          value={formData.yearBuilt}
                          onChange={handleChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Condition
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="new">New</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="needs-work">Needs Work</option>
                        </select>
                      </div>
                    </div>

                    {/* Parking and Floors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaCar className="inline mr-2" />
                          Parking Spaces
                        </label>
                        <input
                          type="number"
                          name="parkingSpaces"
                          value={formData.parkingSpaces}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Floor / Total
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="input flex-1"
                          />
                          <span className="self-center">/</span>
                          <input
                            type="number"
                            name="totalFloors"
                            value={formData.totalFloors}
                            onChange={handleChange}
                            min="1"
                            max="100"
                            className="input flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'amenities' && (
                  <motion.div
                    key="amenities"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <h4 className="font-medium text-gray-700 mb-3">
                      Select Amenities
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {amenitiesList.map(({ id, label, icon: Icon }) => (
                        <motion.button
                          key={id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAmenity(id)}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            formData.amenities.includes(id)
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="text-lg" />
                          <span className="text-sm">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'location' && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Location Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaMapMarkerAlt className="inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., New York, NY or ZIP code"
                        className="input"
                      />
                    </div>

                    {/* Nearby Facilities */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">
                        Nearby Facilities
                      </h4>
                      <div className="space-y-2">
                        {nearbyFacilitiesList.map((facility) => (
                          <label
                            key={facility}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.nearbyFacilities.includes(facility)}
                              onChange={() => toggleFacility(facility)}
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm">{facility}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                loading={loading}
                fullWidth
                className="mt-6"
                size="lg"
              >
                <FaChartLine className="mr-2" />
                Generate Prediction
              </Button>

              {/* History Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full mt-3 text-sm text-gray-600 hover:text-primary-600 flex items-center justify-center gap-2"
              >
                <FaHistory />
                {showHistory ? 'Hide' : 'Show'} Prediction History
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {prediction ? (
            <>
              {/* Main Prediction Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/90 text-sm mb-2">
                        Estimated Property Value
                      </p>
                      <p className="text-4xl font-bold text-white mb-2">
                        {formatPrice(prediction.predictedPrice)}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-white/80 text-sm">
                          Confidence: {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                        <div className="flex items-center gap-1">
                          {prediction.trend === 'up' ? (
                            <FaArrowUp className="text-green-300" />
                          ) : prediction.trend === 'down' ? (
                            <FaArrowDown className="text-red-300" />
                          ) : (
                            <FaEquals className="text-yellow-300" />
                          )}
                          <span className="text-white/80 text-sm">
                            {prediction.trendPercentage || '2.3'}% vs last month
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={exportPrediction}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Export Prediction"
                    >
                      <FaDownload className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="p-6 grid grid-cols-2 gap-4 border-b">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Min Estimate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(prediction.minPrice)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Max Estimate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(prediction.maxPrice)}
                    </p>
                  </div>
                </div>

                {/* Key Factors */}
                {prediction.factors && (
                  <div className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <FaInfoCircle className="text-primary-600" />
                      Key Valuation Factors
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {prediction.factors.map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {factor.factor}
                          </span>
                          <div className="flex items-center gap-2">
                            {factor.impact === 'positive' ? (
                              <FaArrowUp className="text-green-500 text-xs" />
                            ) : factor.impact === 'negative' ? (
                              <FaArrowDown className="text-red-500 text-xs" />
                            ) : (
                              <FaEquals className="text-gray-500 text-xs" />
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                factor.weight === 'high'
                                  ? 'bg-green-100 text-green-700'
                                  : factor.weight === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {factor.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Market Trends */}
              {marketTrends && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
                  <div className="h-64">
                    <ChartLine
                      data={{
                        labels: marketTrends?.map(item => item.month) || [],
                        datasets: [
                          {
                            label: 'Price',
                            data: marketTrends?.map(item => item.price) || [],
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `Price: ${formatPrice(context.raw)}`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            ticks: {
                              callback: (value) => formatPrice(value)
                            }
                          },
                        },
                      }}
                      height={200}
                    />
                  </div>
                </motion.div>
              )}

              {/* Comparable Properties */}
              {comparables && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Comparable Properties
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Address</th>
                          <th className="text-center py-2">Price</th>
                          <th className="text-center py-2">Beds</th>
                          <th className="text-center py-2">Baths</th>
                          <th className="text-center py-2">Sqft</th>
                          <th className="text-center py-2">Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparables.map((comp) => (
                          <tr key={comp.id} className="border-b hover:bg-gray-50">
                            <td className="py-3">{comp.address}</td>
                            <td className="text-center font-medium">
                              {formatPrice(comp.price)}
                            </td>
                            <td className="text-center">{comp.beds}</td>
                            <td className="text-center">{comp.baths}</td>
                            <td className="text-center">{comp.area}</td>
                            <td className="text-center text-gray-500">
                              {comp.soldDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <FaChartLine className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Prediction Yet
                </h3>
                <p className="text-gray-500">
                  Enter property details and click "Generate Prediction" to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prediction History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Prediction History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{item.location}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                          <span>{item.bedrooms} beds</span>
                          <span>{item.bathrooms} baths</span>
                          <span>{item.area} sqft</span>
                          <span>{item.propertyType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No prediction history yet
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricePrediction;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaHome, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

const PricePrediction = () => {
  const [formData, setFormData] = useState({
    propertyType: 'house',
    location: '',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    yearBuilt: new Date().getFullYear() - 10,
    amenities: [],
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    if (!formData.location) {
      toast.error('Please enter a location');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.predictPrice(formData);
      setPrediction(response.prediction);
      toast.success('Price prediction generated!');
    } catch (error) {
      toast.error('Failed to predict price');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FaChartLine className="text-3xl text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">AI Price Prediction</h2>
        <p className="text-gray-600">
          Get an instant property valuation using our AI model
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Property Details</h3>

          <div className="space-y-4">
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
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                className="input"
              />
            </div>

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
                  min="1"
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
                  step="0.5"
                  className="input"
                />
              </div>
            </div>

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
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year Built</label>
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

            <Button
              onClick={handlePredict}
              loading={loading}
              fullWidth
              className="mt-4"
            >
              <FaChartLine className="mr-2" />
              Predict Price
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Prediction Results</h3>

          {prediction ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Main Prediction */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6 text-center">
                <p className="text-sm opacity-90 mb-2">Estimated Value</p>
                <p className="text-4xl font-bold">
                  {formatPrice(prediction.predictedPrice)}
                </p>
                <p className="text-sm opacity-75 mt-2">
                  Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </p>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Min Price</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatPrice(prediction.minPrice)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Max Price</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatPrice(prediction.maxPrice)}
                  </p>
                </div>
              </div>

              {/* Price Factors */}
              {prediction.factors && prediction.factors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Key Price Factors</h4>
                  <div className="space-y-2">
                    {prediction.factors.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">
                          {factor.factor}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            factor.impact === 'high'
                              ? 'bg-green-100 text-green-700'
                              : factor.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {factor.impact} impact
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> This is an AI-generated estimate based
                  on market data. Actual prices may vary based on property
                  condition, exact location, and market conditions.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FaChartLine className="text-6xl mb-4" />
              <p>Enter property details to get a price prediction</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
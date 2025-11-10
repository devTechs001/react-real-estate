import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaTrendingUp,
  FaTrendingDown,
  FaInfoCircle,
} from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const MarketAnalytics = () => {
  const [location, setLocation] = useState('');
  const [timeframe, setTimeframe] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!location) {
      toast.error('Please enter a location');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.getMarketInsights(location, timeframe);
      setAnalytics(response);
      toast.success('Market analysis generated!');
    } catch (error) {
      toast.error('Failed to generate analytics');
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
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FaChartBar className="text-3xl text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Market Analytics</h2>
        <p className="text-gray-600">
          AI-powered market insights and trends analysis
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="input"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        <Button onClick={handleAnalyze} loading={loading} className="mt-4">
          <FaChartBar className="mr-2" />
          Analyze Market
        </Button>
      </div>

      {/* Results */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Price</span>
                <FaInfoCircle className="text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(analytics.trend.avgPrice)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Max Price</span>
                <FaInfoCircle className="text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(analytics.trend.maxPrice)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Min Price</span>
                <FaInfoCircle className="text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(analytics.trend.minPrice)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Trend</span>
                {analytics.trend.trend === 'increasing' ? (
                  <FaTrendingUp className="text-green-500" />
                ) : analytics.trend.trend === 'decreasing' ? (
                  <FaTrendingDown className="text-red-500" />
                ) : (
                  <FaInfoCircle className="text-gray-400" />
                )}
              </div>
              <p className="text-2xl font-bold capitalize">
                <span
                  className={
                    analytics.trend.trend === 'increasing'
                      ? 'text-green-600'
                      : analytics.trend.trend === 'decreasing'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }
                >
                  {analytics.trend.trend}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {analytics.trend.trendPercentage > 0 ? '+' : ''}
                {analytics.trend.trendPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaChartBar className="text-primary-600" />
              AI Market Insights
            </h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {analytics.insights}
            </div>
          </div>

          {/* Data Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Analysis based on:</strong> {analytics.trend.dataPoints}{' '}
              properties over the last {analytics.trend.timeframe} days in{' '}
              {location}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MarketAnalytics;
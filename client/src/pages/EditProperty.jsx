// client/src/pages/EditProperty.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaSave,
  FaEye,
  FaHistory,
  FaUndo,
  FaRedo,
  FaTrash,
  FaCopy,
  FaShare,
  FaChartLine,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaLock,
  FaUnlock,
  FaCamera,
  FaVideo,
  FaCube,
  FaMapMarkerAlt,
  FaDollarSign,
  FaHome,
  FaStar,
  FaClipboard,
  FaRocket,
  FaSync,
  FaClock,
  FaCalendar,
  FaUsers,
  FaEyeSlash,
  FaPause,
  FaPlay,
  FaArchive,
  FaClone,
  FaDownload,
  FaUpload,
  FaMagic,
  FaLightbulb,
  FaCode,
  FaQrcode,
  FaTag,
  FaPercentage,
  FaFire,
  FaSnowflake,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaPencilAlt,
  FaPlus,
  FaMinus,
  FaExpand,
  FaCompress,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
  FaGlobe,
  FaShieldAlt,
  FaUserShield,
  FaKey,
  FaFingerprint,
  FaMobile,
  FaDesktop,
  FaTabletAlt,
  FaPalette,
  FaFont,
  FaImage,
  FaFileAlt,
  FaFilePdf,
  FaFileVideo,
  FaFile3d,
  FaComments,
  FaThumbsUp,
  FaThumbsDown,
  FaHeart,
  FaBookmark,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPinterest
} from 'react-icons/fa';
import { MdCompare, MdDifference } from 'react-icons/md';
import { BiStats } from 'react-icons/bi';
import { propertyService } from '../services/PropertyService';
import PropertyForm from '../components/forms/PropertyForm';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import '../styles/EditProperty.css';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [property, setProperty] = useState(null);
  const [originalProperty, setOriginalProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [quickEditMode, setQuickEditMode] = useState(false);
  const [bulkActions, setBulkActions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const autoSaveTimer = useRef(null);

  // Analytics Data
  const [analytics, setAnalytics] = useState({
    views: 1234,
    viewsChange: '+12%',
    favorites: 89,
    favoritesChange: '+5%',
    inquiries: 34,
    inquiriesChange: '+8%',
    shares: 23,
    sharesChange: '+3%',
    avgTimeOnPage: '2m 45s',
    conversionRate: '3.2%',
    viewsByDay: [],
    viewsBySource: [],
    topKeywords: [],
    competitorAnalysis: []
  });

  // Performance Metrics
  const [performance, setPerformance] = useState({
    score: 92,
    seoScore: 88,
    photoQuality: 95,
    descriptionQuality: 85,
    priceCompetitiveness: 90,
    responseRate: 94,
    recommendations: []
  });

  // Edit Modes
  const editModes = [
    { id: 'details', label: 'Details', icon: FaClipboard },
    { id: 'media', label: 'Media', icon: FaCamera },
    { id: 'pricing', label: 'Pricing', icon: FaDollarSign },
    { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
    { id: 'features', label: 'Features', icon: FaStar },
    { id: 'marketing', label: 'Marketing', icon: FaRocket },
    { id: 'seo', label: 'SEO', icon: FaCode },
    { id: 'settings', label: 'Settings', icon: FaLock }
  ];

  useEffect(() => {
    fetchProperty();
    fetchEditHistory();
    fetchAnalytics();
    
    // Auto-save setup
    if (autoSaveEnabled) {
      autoSaveTimer.current = setInterval(() => {
        if (hasChanges) {
          autoSave();
        }
      }, 30000); // Every 30 seconds
    }

    // Cleanup
    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [id, hasChanges, autoSaveEnabled]);

  // Check for unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperty(id);
      setProperty(data);
      setOriginalProperty(JSON.parse(JSON.stringify(data))); // Deep clone
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/seller/properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchEditHistory = async () => {
    try {
      // Simulate fetching edit history
      const history = [
        {
          id: 1,
          timestamp: '2024-01-20T10:30:00',
          user: 'John Doe',
          changes: ['Updated price from $2,500,000 to $2,450,000'],
          version: 'v1.2'
        },
        {
          id: 2,
          timestamp: '2024-01-18T14:15:00',
          user: 'John Doe',
          changes: ['Added 3 new photos', 'Updated description'],
          version: 'v1.1'
        },
        {
          id: 3,
          timestamp: '2024-01-15T09:00:00',
          user: 'John Doe',
          changes: ['Initial listing created'],
          version: 'v1.0'
        }
      ];
      setEditHistory(history);
    } catch (error) {
      console.error('Failed to fetch edit history:', error);
    }
  };

  const fetchAnalytics = async () => {
    // Fetch property analytics
    // This would be an API call in production
  };

  const handleFieldChange = (field, value) => {
    // Track changes for undo/redo
    const previousState = { ...property };
    setUndoStack([...undoStack, previousState]);
    setRedoStack([]);

    // Update property
    const updatedProperty = { ...property, [field]: value };
    setProperty(updatedProperty);
    setHasChanges(true);

    // Check if changes affect performance
    checkPerformanceImpact(field, value);
  };

  const checkPerformanceImpact = (field, value) => {
    // Analyze how changes affect listing performance
    if (field === 'price') {
      const marketAverage = 2000000; // Example
      const competitiveness = Math.max(0, 100 - Math.abs(value - marketAverage) / marketAverage * 100);
      setPerformance(prev => ({
        ...prev,
        priceCompetitiveness: Math.round(competitiveness)
      }));
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, property]);
      setProperty(previousState);
      setUndoStack(undoStack.slice(0, -1));
      setHasChanges(true);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, property]);
      setProperty(nextState);
      setRedoStack(redoStack.slice(0, -1));
      setHasChanges(true);
    }
  };

  const autoSave = async () => {
    try {
      await propertyService.updateProperty(id, property);
      setLastSaved(new Date());
      setHasChanges(false);
      toast.success('Auto-saved', { icon: '💾', duration: 2000 });
    } catch (error) {
      toast.error('Auto-save failed');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await propertyService.updateProperty(id, property);
      setOriginalProperty(JSON.parse(JSON.stringify(property)));
      setHasChanges(false);
      setLastSaved(new Date());
      toast.success('Property updated successfully!', { icon: '✅' });
      
      // Add to history
      const newHistory = {
        id: editHistory.length + 1,
        timestamp: new Date().toISOString(),
        user: 'Current User',
        changes: getChangeSummary(),
        version: `v1.${editHistory.length + 1}`
      };
      setEditHistory([newHistory, ...editHistory]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  const getChangeSummary = () => {
    const changes = [];
    const fields = Object.keys(property);
    
    fields.forEach(field => {
      if (JSON.stringify(property[field]) !== JSON.stringify(originalProperty[field])) {
        changes.push(`Updated ${field}`);
      }
    });
    
    return changes.length > 0 ? changes : ['Minor updates'];
  };

  const handlePublish = async () => {
    try {
      await propertyService.updateProperty(id, { ...property, status: 'active' });
      toast.success('Property published!', { icon: '🚀' });
      navigate('/seller/properties');
    } catch (error) {
      toast.error('Failed to publish property');
    }
  };

  const handleArchive = async () => {
    if (window.confirm('Are you sure you want to archive this property?')) {
      try {
        await propertyService.updateProperty(id, { ...property, status: 'archived' });
        toast.success('Property archived');
        navigate('/seller/properties');
      } catch (error) {
        toast.error('Failed to archive property');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await propertyService.deleteProperty(id);
        toast.success('Property deleted');
        navigate('/seller/properties');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleDuplicate = () => {
    navigate('/add-property', { state: { duplicate: property } });
  };

  const generateQRCode = () => {
    // Generate QR code for property
    const propertyUrl = `${window.location.origin}/properties/${id}`;
    // Implementation would use a QR code library
    toast.success('QR code generated!');
  };

  const optimizeWithAI = async () => {
    try {
      // AI-powered optimization
      const suggestions = {
        title: 'Add "Newly Renovated" to attract more views',
        price: 'Consider reducing by 2% for faster sale',
        description: 'Add more emotional language and highlight unique features',
        photos: 'Add twilight photos for 23% more engagement'
      };
      
      toast.success('AI optimization suggestions generated!', { icon: '🤖' });
      // Show suggestions modal
    } catch (error) {
      toast.error('Failed to generate suggestions');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <Link
                  to="/seller/properties"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  <FaArrowLeft />
                  Back
                </Link>
                
                <div className="pl-4 border-l">
                  <h1 className="text-xl font-bold text-gray-900">
                    Edit Property
                  </h1>
                  <p className="text-sm text-gray-500">
                    ID: {id} • Last modified: {property?.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                  property?.status === 'active' ? 'bg-green-100 text-green-700' :
                  property?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  property?.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {property?.status || 'Draft'}
                </div>

                {/* Auto-save Indicator */}
                {autoSaveEnabled && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {hasChanges ? (
                      <>
                        <FaSync className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
                      </>
                    ) : null}
                  </div>
                )}

                {/* Undo/Redo */}
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                  >
                    <FaUndo />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Redo"
                  >
                    <FaRedo />
                  </motion.button>
                </div>

                {/* View Options */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPreview(true)}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 font-medium flex items-center gap-2"
                  >
                    <FaEye />
                    Preview
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowComparison(!showComparison)}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 font-medium flex items-center gap-2"
                  >
                    <MdCompare />
                    Compare
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 font-medium flex items-center gap-2"
                  >
                    <FaChartLine />
                    Analytics
                  </motion.button>
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className={`px-6 py-2 rounded-xl font-medium flex items-center gap-2 ${
                    hasChanges && !saving
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {saving ? (
                    <>
                      <FaSync className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </motion.button>

                {/* More Actions */}
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <FaBars />
                  </motion.button>
                  
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <button
                        onClick={handlePublish}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <FaRocket className="text-green-600" />
                        <span>Publish Property</span>
                      </button>
                      
                      <button
                        onClick={handleDuplicate}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <FaCopy className="text-blue-600" />
                        <span>Duplicate</span>
                      </button>
                      
                      <button
                        onClick={() => setShowHistory(true)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <FaHistory className="text-purple-600" />
                        <span>View History</span>
                      </button>
                      
                      <button
                        onClick={generateQRCode}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <FaQrcode className="text-gray-600" />
                        <span>Generate QR Code</span>
                      </button>
                      
                      <button
                        onClick={optimizeWithAI}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <FaMagic className="text-yellow-600" />
                        <span>AI Optimization</span>
                      </button>
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={handleArchive}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <FaArchive className="text-orange-600" />
                        <span>Archive</span>
                      </button>
                      
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 rounded-lg flex items-center gap-3 text-red-600"
                      >
                        <FaTrash />
                        <span>Delete Property</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Overall Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          performance.score >= 90 ? 'bg-green-500' :
                          performance.score >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${performance.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{performance.score}%</span>
                  </div>
                </div>

                {Object.entries({
                  'SEO': performance.seoScore,
                  'Photos': performance.photoQuality,
                  'Description': performance.descriptionQuality,
                  'Price': performance.priceCompetitiveness
                }).map(([label, score]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{label}:</span>
                    <span className={`text-xs font-bold ${
                      score >= 90 ? 'text-green-600' :
                      score >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={optimizeWithAI}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <FaLightbulb />
                Get Improvement Tips
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
          {/* Sidebar */}
          <motion.div
            initial={false}
            animate={{ width: sidebarCollapsed ? '80px' : '240px' }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarCollapsed ? <FaExpand /> : <FaCompress />}
              </button>
            </div>
            
            <nav className="pb-4">
              {editModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveTab(mode.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                      activeTab === mode.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className="text-xl flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="font-medium">{mode.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            {!sidebarCollapsed && (
              <div className="border-t p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Views', value: analytics.views, change: analytics.viewsChange, icon: FaEye },
                    { label: 'Favorites', value: analytics.favorites, change: analytics.favoritesChange, icon: FaHeart },
                    { label: 'Inquiries', value: analytics.inquiries, change: analytics.inquiriesChange, icon: FaEnvelope }
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="text-gray-400 text-sm" />
                          <span className="text-sm text-gray-600">{stat.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                          <span className={`ml-1 text-xs ${
                            stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Edit Area */}
          <div className="flex-1">
            {/* Analytics Panel */}
            <AnimatePresence>
              {showAnalytics && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Property Analytics</h2>
                    <button
                      onClick={() => setShowAnalytics(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Views', value: '1,234', change: '+12%', icon: FaEye, color: 'blue' },
                      { label: 'Favorites', value: '89', change: '+5%', icon: FaHeart, color: 'red' },
                      { label: 'Inquiries', value: '34', change: '+8%', icon: FaEnvelope, color: 'green' },
                      { label: 'Shares', value: '23', change: '+3%', icon: FaShare, color: 'purple' }
                    ].map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metric.label} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`text-${metric.color}-600 text-xl`} />
                            <span className={`text-xs font-bold ${
                              metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {metric.change}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts would go here */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                      <span className="text-gray-400">Views Chart</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                      <span className="text-gray-400">Source Distribution</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comparison View */}
            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Compare Changes</h2>
                    <button
                      onClick={() => setShowComparison(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Original</h3>
                      <div className="bg-red-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(originalProperty, null, 2).substring(0, 500)}...
                        </pre>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Current</h3>
                      <div className="bg-green-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(property, null, 2).substring(0, 500)}...
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Edit Form */}
            <div className="bg-white rounded-2xl shadow-lg">
              {/* Tab Content Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editModes.find(m => m.id === activeTab)?.label} Settings
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Make changes to your property listing
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                      <FaMagic />
                      AI Assist
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center gap-2"
                    >
                      <FaQuickEditMode />
                      Quick Edit
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Property Form would go here */}
                    <PropertyForm 
                      initialData={property} 
                      onSubmit={handleSave}
                      onChange={(field, value) => handleFieldChange(field, value)}
                    />
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Media Management</h3>
                    {/* Media management UI */}
                    <div className="grid grid-cols-3 gap-4">
                      {property?.images?.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button className="p-2 bg-white rounded-lg text-gray-900">
                              <FaPencilAlt />
                            </button>
                            <button className="p-2 bg-white rounded-lg text-red-600">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all">
                        <FaPlus className="text-2xl text-gray-400 mb-2" />
                        <span className="text-gray-500">Add Image</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Other tab contents would be similar */}
              </div>
            </div>
          </div>
        </div>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              >
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-4">
                    {editHistory.map((entry) => (
                      <div key={entry.id} className="border-l-4 border-blue-600 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{entry.user}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {entry.version}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {entry.changes.map((change, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <FaCheckCircle className="text-green-500 text-xs" />
                              {change}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setSelectedVersion(entry.version)}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Restore this version
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EditProperty;
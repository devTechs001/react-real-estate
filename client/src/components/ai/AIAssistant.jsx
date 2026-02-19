import { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Suppress framer-motion scroll offset warning for drag functionality
if (typeof window !== 'undefined' && typeof window.console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = function(...args) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('ensure that the container has a non-static position')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaLightbulb,
  FaHome,
  FaSearch,
  FaDollarSign,
  FaChartLine,
  FaQuestionCircle,
  FaHistory,
  FaCog,
  FaSpinner,
  FaUser,
  FaDownload,
  FaCopy,
  FaTrash,
  FaEdit,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaPaperclip,
  FaImage,
  FaFile,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaSmile,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaRegStar,
  FaGlobe,
  FaMoon,
  FaSun,
  FaKeyboard,
  FaMagic,
  FaBolt,
  FaRedo,
  FaArrowLeft,
  FaEllipsisV,
  FaCamera,
  FaChevronDown,
  FaChevronUp,
  FaCircle
} from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

// ============================================
// CONSTANTS & CONFIGURATIONS
// ============================================

const CHAT_MODES = {
  CHAT: 'chat',
  SEARCH: 'search',
  ANALYZE: 'analyze',
  PREDICT: 'predict'
};

const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error'
};

const INTENT_TYPES = {
  PROPERTY_SEARCH: 'property_search',
  PRICE_PREDICTION: 'price_prediction',
  MARKET_ANALYSIS: 'market_analysis',
  PROPERTY_INFO: 'property_info',
  GENERAL_HELP: 'general_help',
  SCHEDULE_VIEWING: 'schedule_viewing',
  CONTACT_AGENT: 'contact_agent',
  SAVE_PROPERTY: 'save_property',
  GENERAL: 'general'
};

const QUICK_ACTIONS = [
  { id: 1, text: 'Find properties near me', icon: FaHome, category: 'search', color: 'from-blue-500 to-cyan-500', shortText: 'Search' },
  { id: 2, text: 'Market trends', icon: FaChartLine, category: 'analyze', color: 'from-purple-500 to-pink-500', shortText: 'Trends' },
  { id: 3, text: 'Price prediction', icon: FaDollarSign, category: 'predict', color: 'from-green-500 to-emerald-500', shortText: 'Predict' },
  { id: 4, text: 'Investment tips', icon: FaLightbulb, category: 'help', color: 'from-orange-500 to-amber-500', shortText: 'Tips' },
  { id: 5, text: 'Mortgage calculator', icon: FaDollarSign, category: 'tools', color: 'from-indigo-500 to-blue-500', shortText: 'Calculator' },
  { id: 6, text: 'Property comparison', icon: FaSearch, category: 'search', color: 'from-rose-500 to-red-500', shortText: 'Compare' }
];

const SUGGESTIONS_BY_CONTEXT = {
  welcome: [
    { icon: FaHome, text: "Find properties near me", action: "search" },
    { icon: FaDollarSign, text: "Predict property price", action: "predict" },
    { icon: FaChartLine, text: "Show market trends", action: "trends" },
    { icon: FaQuestionCircle, text: "How can I help you?", action: "help" }
  ],
  search_complete: [
    { text: "Show more details", action: "details" },
    { text: "Refine search", action: "refine" },
    { text: "Save search", action: "save" },
    { text: "Schedule viewing", action: "schedule" }
  ],
  price_complete: [
    { text: "View market trends", action: "trends" },
    { text: "Compare properties", action: "compare" },
    { text: "Get detailed report", action: "report" }
  ]
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const TYPING_SPEED = 30; // Faster on mobile
const MAX_MESSAGE_LENGTH = 2000;
const STORAGE_KEY = 'ai_assistant_chat_history';
const SETTINGS_KEY = 'ai_assistant_settings';
const SWIPE_THRESHOLD = 100;
const HAPTIC_ENABLED = 'vibrate' in navigator;

// ============================================
// UTILITY FUNCTIONS
// ============================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatTimestamp = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied!', { duration: 2000 });
    hapticFeedback('success');
    return true;
  } catch (err) {
    toast.error('Failed to copy');
    return false;
  }
};

const downloadAsFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  hapticFeedback('success');
};

const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return FaImage;
  if (fileType.includes('pdf')) return FaFile;
  return FaFile;
};

const validateFile = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File ${file.name} exceeds 10MB limit`);
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not supported`);
  }
  return true;
};

let hasUserInteracted = false;

// Track user interaction for haptic feedback permission
if (typeof window !== 'undefined') {
  const enableHaptics = () => { hasUserInteracted = true; };
  window.addEventListener('click', enableHaptics, { once: true });
  window.addEventListener('touchstart', enableHaptics, { once: true });
}

const hapticFeedback = (type = 'light') => {
  if (!HAPTIC_ENABLED || !hasUserInteracted) return;

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    error: [20, 100, 20]
  };

  try {
    if (Array.isArray(patterns[type])) {
      navigator.vibrate(patterns[type]);
    } else {
      navigator.vibrate(patterns[type]);
    }
  } catch (e) {
    // Vibration not supported
  }
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

const preventZoom = (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
};

// ============================================
// CHAT REDUCER
// ============================================

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        lastActivity: Date.now()
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        )
      };
    
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(msg => msg.id !== action.payload)
      };
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        lastActivity: Date.now()
      };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    
    case 'LOAD_HISTORY':
      return {
        ...state,
        messages: action.payload,
        lastActivity: Date.now()
      };
    
    default:
      return state;
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const AIAssistant = () => {
  // ========== STATE MANAGEMENT ==========
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    isTyping: false,
    isLoading: false,
    suggestions: SUGGESTIONS_BY_CONTEXT.welcome,
    lastActivity: null
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mode, setMode] = useState(CHAT_MODES.CHAT);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    voiceEnabled: true,
    darkMode: false,
    language: 'en',
    autoSpeak: false,
    hapticEnabled: true,
    reduceMotion: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const containerRef = useRef(null);
  const controls = useAnimation();

  // ========== MOBILE DETECTION ==========
  const mobile = useMemo(() => isMobile(), []);

  // ========== EFFECTS ==========

  // Prevent zoom on double tap (iOS)
  useEffect(() => {
    if (mobile) {
      document.addEventListener('touchstart', preventZoom, { passive: false });
      return () => document.removeEventListener('touchstart', preventZoom);
    }
  }, [mobile]);

  // Handle keyboard on mobile
  useEffect(() => {
    if (!mobile) return;

    const handleResize = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const keyboardHeight = window.innerHeight - visualViewport.height;
        setKeyboardHeight(keyboardHeight);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, [mobile]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'es' ? 'es-ES' : 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
        
        if (event.results[0].isFinal && settings.autoSpeak) {
          handleSend();
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('Speech recognition failed', { duration: 2000 });
          hapticFeedback('error');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [settings.language, settings.autoSpeak]);

  // Load chat history and settings
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const messages = JSON.parse(savedHistory);
        dispatch({ type: 'LOAD_HISTORY', payload: messages.slice(-50) });
      }

      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Detect system dark mode preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setSettings(prev => ({ ...prev, darkMode: true }));
      }

      // Detect reduced motion preference
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setSettings(prev => ({ ...prev, reduceMotion: true }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (state.messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [state.messages]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!settings.reduceMotion) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [state.messages, state.isTyping, settings.reduceMotion]);

  // Track unread messages
  useEffect(() => {
    if (!isOpen && state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage.type === MESSAGE_TYPES.ASSISTANT) {
        setUnreadCount(prev => prev + 1);
        
        if (settings.soundEnabled && !document.hidden) {
          const audio = new Audio('/sounds/notification.mp3');
          audio.play().catch(() => {});
        }
        
        if (settings.hapticEnabled) {
          hapticFeedback('medium');
        }

        // Show notification on mobile
        if (mobile && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('AI Assistant', {
            body: lastMessage.content.substring(0, 100) + '...',
            icon: '/logo.png',
            badge: '/logo.png',
            tag: 'ai-assistant'
          });
        }
      }
    } else {
      setUnreadCount(0);
    }
  }, [state.messages, isOpen, settings.soundEnabled, settings.hapticEnabled, mobile]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !mobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, mobile]);

  // Initialize animation controls when chat opens
  useEffect(() => {
    if (isOpen) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        height: isFullScreen ? '100vh' : mobile ? 'auto' : '650px'
      });
    }
  }, [isOpen, isFullScreen, mobile, controls]);

  // Keyboard shortcuts (desktop only)
  useEffect(() => {
    if (mobile) return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        hapticFeedback('light');
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        hapticFeedback('light');
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        showKeyboardShortcuts();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mobile]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && containerRef.current && !containerRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMenu]);

  // Request notification permission on mobile
  useEffect(() => {
    if (mobile && 'Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
    }
  }, [mobile]);

  // ========== MEMOIZED VALUES ==========

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return state.messages;
    return state.messages.filter(msg =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [state.messages, searchQuery]);

  const bookmarkedMessages = useMemo(() => {
    return state.messages.filter(msg => msg.bookmarked);
  }, [state.messages]);

  const characterCount = useMemo(() => input.length, [input]);
  const isInputValid = useMemo(() => input.trim().length > 0 && input.length <= MAX_MESSAGE_LENGTH, [input]);

  // ========== MESSAGE PROCESSING ==========

  const handleSend = useCallback(async () => {
    if (!isInputValid || state.isLoading) return;

    hapticFeedback('light');
    const messageContent = input.trim();
    const userMessage = {
      id: generateId(),
      type: MESSAGE_TYPES.USER,
      content: messageContent,
      timestamp: new Date(),
      bookmarked: false,
      reactions: [],
      attachments: selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInput('');
    setSelectedFiles([]);
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_TYPING', payload: true });

    // Hide keyboard on mobile
    if (mobile && inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const response = await processMessage(messageContent);
      
      // Simulate typing effect (shorter on mobile)
      await new Promise(resolve => setTimeout(resolve, mobile ? 500 : Math.min(response.content.length * TYPING_SPEED, 2000)));

      const aiMessage = {
        id: generateId(),
        type: MESSAGE_TYPES.ASSISTANT,
        content: response.content,
        data: response.data,
        suggestions: response.suggestions,
        timestamp: new Date(),
        bookmarked: false,
        reactions: [],
        metadata: response.metadata
      };

      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

      if (response.suggestions) {
        dispatch({ type: 'SET_SUGGESTIONS', payload: response.suggestions });
      }

      if (settings.soundEnabled && settings.autoSpeak && response.speak !== false) {
        speak(response.content);
      }

      hapticFeedback('success');

    } catch (error) {
      console.error('AI processing error:', error);
      
      const errorMessage = {
        id: generateId(),
        type: MESSAGE_TYPES.ERROR,
        content: "I'm having trouble processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        bookmarked: false,
        reactions: []
      };

      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      toast.error('Failed to get response', { duration: 2000 });
      hapticFeedback('error');
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [input, selectedFiles, state.isLoading, isInputValid, settings.soundEnabled, settings.autoSpeak, mobile]);

  const processMessage = async (message) => {
    const intent = await detectIntent(message);
    
    switch (intent.type) {
      case INTENT_TYPES.PROPERTY_SEARCH:
        return await handlePropertySearch(intent.parameters);
      case INTENT_TYPES.PRICE_PREDICTION:
        return await handlePricePrediction(intent.parameters);
      case INTENT_TYPES.MARKET_ANALYSIS:
        return await handleMarketAnalysis(intent.parameters);
      case INTENT_TYPES.PROPERTY_INFO:
        return await handlePropertyInfo(intent.parameters);
      case INTENT_TYPES.GENERAL_HELP:
        return handleGeneralHelp();
      case INTENT_TYPES.SCHEDULE_VIEWING:
        return await handleScheduleViewing(intent.parameters);
      case INTENT_TYPES.CONTACT_AGENT:
        return handleContactAgent(intent.parameters);
      default:
        return await handleGeneralQuery(message);
    }
  };

  const detectIntent = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    const searchKeywords = ['find', 'search', 'show', 'properties', 'houses', 'apartments', 'looking for'];
    if (searchKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        type: INTENT_TYPES.PROPERTY_SEARCH,
        parameters: extractSearchParameters(message)
      };
    }
    
    const priceKeywords = ['price', 'value', 'worth', 'predict', 'estimate', 'cost'];
    if (priceKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        type: INTENT_TYPES.PRICE_PREDICTION,
        parameters: extractPriceParameters(message)
      };
    }
    
    const marketKeywords = ['market', 'trend', 'analysis', 'forecast', 'statistics'];
    if (marketKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        type: INTENT_TYPES.MARKET_ANALYSIS,
        parameters: extractMarketParameters(message)
      };
    }

    const scheduleKeywords = ['schedule', 'viewing', 'tour', 'visit', 'appointment'];
    if (scheduleKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        type: INTENT_TYPES.SCHEDULE_VIEWING,
        parameters: extractScheduleParameters(message)
      };
    }

    const contactKeywords = ['contact', 'agent', 'call', 'email', 'reach'];
    if (contactKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        type: INTENT_TYPES.CONTACT_AGENT,
        parameters: {}
      };
    }
    
    const helpKeywords = ['help', 'how', 'what can you', 'capabilities', 'features'];
    if (helpKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return { type: INTENT_TYPES.GENERAL_HELP, parameters: {} };
    }
    
    return { type: INTENT_TYPES.GENERAL, parameters: {} };
  };

  const extractSearchParameters = (message) => {
    const params = {};
    const lowerMessage = message.toLowerCase();
    
    const locationPatterns = [
      /in\s+([A-Za-z\s]+?)(?:\s+with|\s+that|\s*,|\s*$)/i,
      /near\s+([A-Za-z\s]+?)(?:\s+with|\s+that|\s*,|\s*$)/i,
      /at\s+([A-Za-z\s]+?)(?:\s+with|\s+that|\s*,|\s*$)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = message.match(pattern);
      if (match) {
        params.location = match[1].trim();
        break;
      }
    }
    
    const propertyTypes = {
      'apartment': ['apartment', 'apt', 'flat'],
      'house': ['house', 'home', 'single family'],
      'villa': ['villa', 'mansion'],
      'condo': ['condo', 'condominium'],
      'studio': ['studio'],
      'townhouse': ['townhouse', 'town house']
    };
    
    for (const [type, keywords] of Object.entries(propertyTypes)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        params.propertyType = type;
        break;
      }
    }
    
    const bedroomMatches = [
      message.match(/(\d+)\s*(?:bed|bedroom)/i),
      message.match(/(\d+)br/i)
    ];
    
    for (const match of bedroomMatches) {
      if (match) {
        params.bedrooms = parseInt(match[1]);
        break;
      }
    }
    
    const bathroomMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom)/i);
    if (bathroomMatch) {
      params.bathrooms = parseFloat(bathroomMatch[1]);
    }
    
    const pricePatterns = [
      /\$?(\d+)k?\s*(?:to|-|–)\s*\$?(\d+)k?/i,
      /under\s*\$?(\d+)k?/i,
      /over\s*\$?(\d+)k?/i,
      /around\s*\$?(\d+)k?/i
    ];
    
    for (const pattern of pricePatterns) {
      const match = message.match(pattern);
      if (match) {
        const multiplier = message.includes('k') || message.includes('K') ? 1000 : 1;
        
        if (pattern === pricePatterns[0]) {
          params.minPrice = parseInt(match[1]) * multiplier;
          params.maxPrice = parseInt(match[2]) * multiplier;
        } else if (pattern === pricePatterns[1]) {
          params.maxPrice = parseInt(match[1]) * multiplier;
        } else if (pattern === pricePatterns[2]) {
          params.minPrice = parseInt(match[1]) * multiplier;
        } else {
          const price = parseInt(match[1]) * multiplier;
          params.minPrice = price * 0.9;
          params.maxPrice = price * 1.1;
        }
        break;
      }
    }
    
    const sqftMatch = message.match(/(\d+)\s*(?:sq\.?\s*ft|square\s*feet|sqft)/i);
    if (sqftMatch) {
      params.minSqft = parseInt(sqftMatch[1]);
    }

    const amenities = [];
    const amenityKeywords = {
      pool: ['pool', 'swimming'],
      garage: ['garage', 'parking'],
      garden: ['garden', 'yard', 'backyard'],
      balcony: ['balcony', 'terrace'],
      gym: ['gym', 'fitness'],
      'pet-friendly': ['pet', 'dog', 'cat']
    };

    for (const [amenity, keywords] of Object.entries(amenityKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        amenities.push(amenity);
      }
    }
    if (amenities.length > 0) params.amenities = amenities;
    
    return params;
  };

  const extractPriceParameters = (message) => {
    return extractSearchParameters(message);
  };

  const extractMarketParameters = (message) => {
    const params = {};
    
    const locationMatch = message.match(/(?:in|for|at)\s+([A-Za-z\s]+?)(?:\s+area|\s*$|\s*,)/i);
    if (locationMatch) {
      params.location = locationMatch[1].trim();
    }
    
    const periodMatch = message.match(/(last|past|next)\s+(\d+)\s+(year|month|quarter)/i);
    if (periodMatch) {
      params.period = {
        direction: periodMatch[1],
        value: parseInt(periodMatch[2]),
        unit: periodMatch[3]
      };
    }
    
    return params;
  };

  const extractScheduleParameters = (message) => {
    const params = {};
    
    const dateKeywords = ['tomorrow', 'today', 'this week', 'next week', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const keyword of dateKeywords) {
      if (message.toLowerCase().includes(keyword)) {
        params.dateHint = keyword;
        break;
      }
    }
    
    const timeMatch = message.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (timeMatch) {
      params.timeHint = timeMatch[0];
    }
    
    return params;
  };

  // ========== INTENT HANDLERS ==========

  const handlePropertySearch = async (parameters) => {
    try {
      const results = await aiService.searchProperties(parameters);
      
      let responseText = `I found **${results.length} properties** matching your criteria`;
      if (parameters.location) responseText += ` in ${parameters.location}`;
      if (parameters.propertyType) responseText += ` (${parameters.propertyType}s)`;
      if (parameters.bedrooms) responseText += ` with ${parameters.bedrooms} bedroom${parameters.bedrooms > 1 ? 's' : ''}`;
      if (parameters.minPrice || parameters.maxPrice) {
        responseText += ` in the price range of ${formatPrice(parameters.minPrice || 0)} - ${formatPrice(parameters.maxPrice || 999999999)}`;
      }
      responseText += '.';

      return {
        content: responseText,
        data: results,
        suggestions: SUGGESTIONS_BY_CONTEXT.search_complete,
        speak: true,
        metadata: { intent: INTENT_TYPES.PROPERTY_SEARCH, parameters }
      };
    } catch (error) {
      return {
        content: "I encountered an issue searching for properties. Could you try refining your search criteria?",
        speak: true
      };
    }
  };

  const handlePricePrediction = async (parameters) => {
    try {
      const prediction = await aiService.predictPrice(parameters);
      
      const responseText = `Based on my AI analysis of current market conditions, comparable sales, and property features, I predict the value to be approximately **${formatPrice(prediction.price)}** with a confidence level of **${prediction.confidence}%**.

Key factors influencing this estimate:
• Location market trends
• Property size and condition
• Recent comparable sales
• Current demand indicators`;

      return {
        content: responseText,
        data: prediction,
        suggestions: SUGGESTIONS_BY_CONTEXT.price_complete,
        speak: true,
        metadata: { intent: INTENT_TYPES.PRICE_PREDICTION, prediction }
      };
    } catch (error) {
      return {
        content: "I'm unable to predict the price at this moment. Could you provide more details about the property?",
        speak: true
      };
    }
  };

  const handleMarketAnalysis = async (parameters) => {
    try {
      const analysis = await aiService.getMarketAnalysis(parameters);
      
      const location = parameters.location || 'your area';
      const responseText = `Here's the market analysis for **${location}**:

📊 **Market Overview**
• Average Price: ${formatPrice(analysis.averagePrice)}
• Price Trend: ${analysis.trend > 0 ? '📈 Increasing' : '📉 Decreasing'} (${Math.abs(analysis.trend)}%)
• Inventory: ${analysis.inventory} active listings
• Days on Market: ${analysis.daysOnMarket} days average

💡 **Key Insights**
${analysis.insights.slice(0, 3).map(insight => `• ${insight}`).join('\n')}`;

      return {
        content: responseText,
        data: analysis,
        suggestions: [
          { text: "View price predictions", action: "predict" },
          { text: "Compare with other areas", action: "compare" },
          { text: "Investment opportunities", action: "invest" },
          { text: "Download report", action: "download" }
        ],
        speak: true,
        metadata: { intent: INTENT_TYPES.MARKET_ANALYSIS, location }
      };
    } catch (error) {
      return {
        content: "I couldn't fetch the market analysis. Please try again or specify a different location.",
        speak: true
      };
    }
  };

  const handlePropertyInfo = async (parameters) => {
    try {
      const info = await aiService.getPropertyInfo(parameters.propertyId);
      
      return {
        content: `Here are the details for this property:

🏡 **${info.title}**
📍 ${info.address}
💰 Price: ${formatPrice(info.price)}
🛏️ ${info.bedrooms} bed | 🚿 ${info.bathrooms} bath | 📐 ${info.sqft} sq ft

✨ **Highlights**
${info.features.slice(0, 5).map(feature => `• ${feature}`).join('\n')}`,
        data: info,
        suggestions: [
          { text: "Schedule viewing", action: "schedule" },
          { text: "Contact agent", action: "contact" },
          { text: "Similar properties", action: "similar" },
          { text: "Save property", action: "save" }
        ],
        speak: true
      };
    } catch (error) {
      return {
        content: "I couldn't retrieve the property information. Please try again.",
        speak: true
      };
    }
  };

  const handleScheduleViewing = async (parameters) => {
    return {
      content: `I'd be happy to help you schedule a property viewing! 

Please provide:
1. Which property you'd like to view
2. Your preferred date (e.g., "tomorrow", "next Monday")
3. Your preferred time (e.g., "2 PM", "morning")

You can also call our office directly at (555) 123-4567 to schedule immediately.`,
      suggestions: [
        { text: "Tomorrow at 2 PM", action: "schedule_time" },
        { text: "This weekend morning", action: "schedule_time" },
        { text: "Contact agent directly", action: "contact" }
      ],
      speak: true
    };
  };

  const handleContactAgent = (parameters) => {
    return {
      content: `You can reach our team in several ways:

📞 **Phone**: (555) 123-4567
📧 **Email**: info@homescape.com
💬 **Live Chat**: Available 9 AM - 6 PM EST

Our agents typically respond within 15 minutes during business hours. Would you like me to connect you with an agent now?`,
      suggestions: [
        { text: "Yes, connect me", action: "connect_agent" },
        { text: "Send email", action: "email_agent" },
        { text: "Request callback", action: "callback" }
      ],
      speak: true
    };
  };

  const handleGeneralHelp = () => {
    return {
      content: `Hi! I'm your AI real estate assistant. Here's how I can help you:

🏠 **Property Search**
Find homes based on location, price, size, and features

💰 **Price Predictions**
Get AI-powered property value estimates

📊 **Market Analysis**
View trends, statistics, and forecasts

📅 **Schedule Viewings**
Book property tours at your convenience

🤝 **Connect with Agents**
Get expert human assistance

💡 **Investment Advice**
Receive personalized recommendations

Just ask me anything! You can say things like:
• "Find 3-bedroom homes in Austin under $500k"
• "What's the market trend in Miami?"
• "Predict the value of a 2000 sq ft condo"`,
      suggestions: SUGGESTIONS_BY_CONTEXT.welcome,
      speak: true
    };
  };

  const handleGeneralQuery = async (message) => {
    try {
      const response = await aiService.askQuestion(message);
      
      return {
        content: response.answer || "I understand your question. Let me help you with that...",
        data: response.data,
        suggestions: response.suggestions || SUGGESTIONS_BY_CONTEXT.welcome,
        speak: true
      };
    } catch (error) {
      return {
        content: "I'm not sure I understand. Could you rephrase that or ask about properties, prices, or market trends?",
        suggestions: SUGGESTIONS_BY_CONTEXT.welcome,
        speak: true
      };
    }
  };

  // ========== VOICE HANDLERS ==========

  const handleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported', { duration: 2000 });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      hapticFeedback('light');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening...', { duration: 2000, icon: '🎤' });
        hapticFeedback('medium');
      } catch (error) {
        console.error('Speech recognition error:', error);
        setIsListening(false);
        toast.error('Could not start speech recognition', { duration: 2000 });
        hapticFeedback('error');
      }
    }
  }, [isListening]);

  const speak = useCallback((text) => {
    if (!synthRef.current || !settings.soundEnabled) return;
    
    synthRef.current.cancel();
    
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/[#•]/g, '')
      .replace(/\n+/g, '. ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = mobile ? 1.1 : 1; // Slightly faster on mobile
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google UK English Female')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    synthRef.current.speak(utterance);
  }, [settings.soundEnabled, mobile]);

  const toggleSound = useCallback(() => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    hapticFeedback('light');
    if (!settings.soundEnabled) {
      toast.success('Sound enabled', { duration: 1500 });
    } else {
      synthRef.current?.cancel();
      toast.success('Sound disabled', { duration: 1500 });
    }
  }, [settings.soundEnabled]);

  // ========== FILE HANDLERS ==========

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`, { duration: 2000 });
      hapticFeedback('error');
      return;
    }

    try {
      files.forEach(validateFile);
      setSelectedFiles(prev => [...prev, ...files]);
      toast.success(`${files.length} file(s) attached`, { duration: 1500 });
      hapticFeedback('success');
    } catch (error) {
      toast.error(error.message, { duration: 2000 });
      hapticFeedback('error');
    }

    e.target.value = '';
  }, [selectedFiles]);

  const handleCameraCapture = useCallback((e) => {
    handleFileSelect(e);
  }, [handleFileSelect]);

  const removeFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    hapticFeedback('light');
  }, []);

  // ========== MESSAGE ACTIONS ==========

  const handleSuggestionClick = useCallback((suggestion) => {
    setInput(suggestion.text);
    hapticFeedback('light');
    if (mobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [mobile]);

  const handleQuickAction = useCallback((action) => {
    setInput(action.text);
    setMode(action.category);
    hapticFeedback('light');
    setTimeout(() => inputRef.current?.focus(), mobile ? 100 : 0);
  }, [mobile]);

  const toggleBookmark = useCallback((messageId) => {
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: {
        id: messageId,
        updates: {
          bookmarked: !state.messages.find(m => m.id === messageId)?.bookmarked
        }
      }
    });
    toast.success('Message bookmarked', { duration: 1500 });
    hapticFeedback('success');
  }, [state.messages]);

  const addReaction = useCallback((messageId, reaction) => {
    const message = state.messages.find(m => m.id === messageId);
    const reactions = message?.reactions || [];
    
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: {
        id: messageId,
        updates: {
          reactions: [...reactions, { type: reaction, userId: user?.id, timestamp: new Date() }]
        }
      }
    });
    hapticFeedback('light');
  }, [state.messages, user]);

  const deleteMessage = useCallback((messageId) => {
    if (window.confirm('Delete this message?')) {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
      toast.success('Message deleted', { duration: 1500 });
      hapticFeedback('success');
    }
  }, []);

  const copyMessage = useCallback((content) => {
    copyToClipboard(content);
  }, []);

  const shareMessage = useCallback(async (message) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Assistant Message',
          text: message.content,
        });
        hapticFeedback('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(message.content);
        }
      }
    } else {
      copyToClipboard(message.content);
    }
  }, []);

  // ========== CHAT MANAGEMENT ==========

  const clearChat = useCallback(() => {
    if (window.confirm('Clear all messages? This cannot be undone.')) {
      dispatch({ type: 'CLEAR_MESSAGES' });
      localStorage.removeItem(STORAGE_KEY);
      toast.success('Chat cleared', { duration: 1500 });
      hapticFeedback('success');
      setShowMenu(false);
    }
  }, []);

  const exportChat = useCallback(() => {
    const content = state.messages
      .map(msg => `[${formatTimestamp(msg.timestamp)}] ${msg.type.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    downloadAsFile(content, `ai-chat-${new Date().toISOString().slice(0, 10)}.txt`);
    toast.success('Chat exported', { duration: 1500 });
    setShowMenu(false);
  }, [state.messages]);

  const showKeyboardShortcuts = useCallback(() => {
    const shortcuts = mobile ? `
Touch Gestures:

Swipe down - Minimize chat
Swipe up - Maximize chat
Long press - Message options
Double tap - Quick action
    `.trim() : `
Keyboard Shortcuts:

Ctrl/Cmd + K - Toggle chat
Escape - Close chat
Ctrl/Cmd + / - Show shortcuts
Enter - Send message
Shift + Enter - New line
    `.trim();
    
    toast(shortcuts, { duration: 5000, icon: mobile ? '👆' : '⌨️' });
  }, [mobile]);

  // ========== SWIPE HANDLERS ==========

  const handleDragEnd = useCallback((event, info) => {
    const { offset, velocity } = info;
    
    if (offset.y > SWIPE_THRESHOLD || velocity.y > 500) {
      // Swipe down - minimize/close
      if (isFullScreen) {
        setIsFullScreen(false);
        hapticFeedback('medium');
      } else {
        setIsOpen(false);
        hapticFeedback('light');
      }
      setDragOffset(0);
    } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -500) {
      // Swipe up - maximize
      setIsFullScreen(true);
      hapticFeedback('medium');
      setDragOffset(0);
    } else {
      // Snap back
      controls.start({ y: 0 });
      setDragOffset(0);
    }
  }, [isFullScreen, controls]);

  const handleDrag = useCallback((event, info) => {
    setDragOffset(info.offset.y);
  }, []);

  // ========== RENDER ==========

  return (
    <>
      {/* ========== FLOATING BUTTON ========== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={!mobile ? { scale: 1.1 } : {}}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              hapticFeedback('medium');
            }}
            className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-0 group focus:outline-none active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              touchAction: 'manipulation'
            }}
            aria-label="Open AI Assistant"
          >
            {/* Pulse rings */}
            {!settings.reduceMotion && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
              </>
            )}

            {/* Inner glow */}
            <div className="absolute inset-1 rounded-full bg-white/10 backdrop-blur-sm pointer-events-none" />

            {/* Robot icon */}
            <motion.div
              animate={!settings.reduceMotion ? { rotate: [0, 8, -8, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
              className="relative z-10 pointer-events-none"
            >
              <FaRobot className="text-3xl text-white drop-shadow-lg" />
            </motion.div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[1.75rem] h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg px-2 pointer-events-none"
              >
                <span className="text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            )}

            {/* Listening indicator */}
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500 pointer-events-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ========== CHAT WINDOW ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: mobile ? '100%' : 20, scale: mobile ? 1 : 0.9 }}
            animate={controls}
            exit={{ opacity: 0, y: mobile ? '100%' : 20, scale: mobile ? 1 : 0.9 }}
            transition={{
              type: mobile ? "tween" : "spring",
              stiffness: 300,
              damping: 30,
              duration: mobile ? 0.3 : undefined
            }}
            drag={mobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`fixed z-50 overflow-hidden backdrop-blur-2xl ${
              mobile
                ? isFullScreen
                  ? 'inset-0 rounded-none'
                  : 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh]'
                : 'bottom-6 right-6 w-[420px] rounded-3xl'
            } ${isMinimized ? 'h-16' : ''}`}
            style={{
              background: settings.darkMode
                ? 'linear-gradient(135deg, rgba(17,24,39,0.98) 0%, rgba(31,41,55,0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
              boxShadow: mobile
                ? '0 -10px 40px rgba(0, 0, 0, 0.3)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              touchAction: 'pan-y',
              paddingBottom: mobile ? `${keyboardHeight}px` : 0
            }}
          >
            {/* Drag Handle (Mobile) */}
            {mobile && (
              <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            )}

            {/* ========== HEADER ========== */}
            <div
              className="relative overflow-hidden px-4 py-4"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              }}
            >
              {/* Animated background pattern */}
              {!settings.reduceMotion && (
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }} />
                </div>
              )}

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* AI Avatar */}
                  <motion.div
                    animate={!settings.reduceMotion ? { rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                    className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30 flex-shrink-0"
                  >
                    <FaRobot className="text-2xl text-white" />
                  </motion.div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-white tracking-tight truncate">AI Assistant</h3>
                    <div className="flex items-center gap-2 text-xs text-white/90">
                      <motion.span 
                        className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="truncate">
                        {state.isTyping ? 'Typing...' : 'Online • Ready to help'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1">
                  {/* Sound Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSound}
                    className="p-2.5 hover:bg-white/20 active:bg-white/30 rounded-xl transition-all"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {settings.soundEnabled ? 
                      <FaVolumeUp className="text-white text-sm" /> : 
                      <FaVolumeMute className="text-white text-sm" />
                    }
                  </motion.button>

                  {/* Fullscreen Toggle (Mobile) */}
                  {mobile && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setIsFullScreen(!isFullScreen);
                        hapticFeedback('medium');
                      }}
                      className="p-2.5 hover:bg-white/20 active:bg-white/30 rounded-xl transition-all"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {isFullScreen ? 
                        <FaCompress className="text-white text-sm" /> : 
                        <FaExpand className="text-white text-sm" />
                      }
                    </motion.button>
                  )}

                  {/* Menu Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowMenu(!showMenu);
                      hapticFeedback('light');
                    }}
                    className="p-2.5 hover:bg-white/20 active:bg-white/30 rounded-xl transition-all"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <FaEllipsisV className="text-white text-sm" />
                  </motion.button>

                  {/* Close Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsOpen(false);
                      hapticFeedback('light');
                    }}
                    className="p-2.5 hover:bg-white/20 active:bg-white/30 rounded-xl transition-all ml-1"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <FaTimes className="text-white text-sm" />
                  </motion.button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {[
                  { id: CHAT_MODES.CHAT, icon: FaRobot, label: 'Chat' },
                  { id: CHAT_MODES.SEARCH, icon: FaSearch, label: 'Search' },
                  { id: CHAT_MODES.ANALYZE, icon: FaChartLine, label: 'Analyze' },
                  { id: CHAT_MODES.PREDICT, icon: FaBolt, label: 'Predict' },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMode(item.id);
                      hapticFeedback('light');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 backdrop-blur-sm border whitespace-nowrap flex-shrink-0 ${
                      mode === item.id
                        ? 'bg-white text-purple-600 shadow-lg border-white/50'
                        : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30 border-white/20'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <item.icon className="text-xs" />
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Menu Dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`absolute ${mobile ? 'right-4 top-20' : 'right-4 top-20'} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 w-56 z-50 overflow-hidden`}
                  >
                    <button
                      onClick={() => { 
                        clearChat(); 
                        hapticFeedback('medium');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition-colors"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <FaTrash className="text-red-500" />
                      Clear chat
                    </button>
                    <button
                      onClick={() => { 
                        exportChat(); 
                        hapticFeedback('medium');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition-colors"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <FaDownload className="text-blue-500" />
                      Export chat
                    </button>
                    <button
                      onClick={() => { 
                        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode })); 
                        setShowMenu(false); 
                        hapticFeedback('light');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition-colors"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {settings.darkMode ? 
                        <FaSun className="text-yellow-500" /> : 
                        <FaMoon className="text-indigo-500" />
                      }
                      {settings.darkMode ? 'Light mode' : 'Dark mode'}
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                    <button
                      onClick={() => { 
                        setShowSettings(true); 
                        setShowMenu(false); 
                        hapticFeedback('light');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition-colors"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <FaCog className="text-gray-500" />
                      Settings
                    </button>
                    <button
                      onClick={() => { 
                        showKeyboardShortcuts(); 
                        setShowMenu(false); 
                        hapticFeedback('light');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition-colors"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {mobile ? <FaGlobe className="text-gray-500" /> : <FaKeyboard className="text-gray-500" />}
                      {mobile ? 'Gestures' : 'Shortcuts'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isMinimized && (
              <>
                {/* ========== MESSAGES AREA ========== */}
                <div
                  className="overflow-y-auto px-4 py-4 space-y-4 overscroll-contain"
                  style={{
                    height: mobile 
                      ? isFullScreen 
                        ? 'calc(100vh - 240px)' 
                        : 'calc(90vh - 240px)'
                      : '400px',
                    WebkitOverflowScrolling: 'touch',
                    background: settings.darkMode
                      ? 'linear-gradient(180deg, rgba(17,24,39,0.5) 0%, rgba(31,41,55,0.8) 100%)'
                      : 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(255,255,255,0.8) 100%)',
                  }}
                >
                  {/* Welcome Screen */}
                  {filteredMessages.length === 0 && !searchQuery && (
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center shadow-xl"
                      >
                        <motion.div
                          animate={!settings.reduceMotion ? { y: [0, -8, 0], rotate: [0, 5, -5, 0] } : {}}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <FaRobot className="text-5xl text-purple-600 dark:text-purple-400" />
                        </motion.div>
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 px-4"
                      >
                        Hello! I'm your AI Assistant
                      </motion.h3>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-xs mx-auto px-4"
                      >
                        Ask me anything about real estate, properties, market trends, or get personalized recommendations
                      </motion.p>

                      {/* Quick Actions Grid */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 gap-3 max-w-sm mx-auto px-4"
                      >
                        {state.suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleSuggestionClick(suggestion);
                              hapticFeedback('light');
                            }}
                            className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700 rounded-2xl text-left text-sm transition-all shadow-md hover:shadow-lg active:shadow backdrop-blur-sm border border-gray-100 dark:border-gray-700 group"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${QUICK_ACTIONS.find(a => a.text === suggestion.text)?.color || 'from-purple-500 to-pink-500'} flex items-center justify-center flex-shrink-0 shadow-md group-active:shadow transition-shadow`}>
                              {suggestion.icon && <suggestion.icon className="text-white text-base" />}
                            </div>
                            <span className="text-gray-700 dark:text-gray-200 font-medium flex-1">{suggestion.text}</span>
                            <FaSearch className="text-gray-300 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                          </motion.button>
                        ))}
                      </motion.div>
                    </div>
                  )}

                  {/* Messages */}
                  {filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.03, type: "spring", stiffness: 300 }}
                      className={`flex items-end gap-2 ${message.type === MESSAGE_TYPES.USER ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Assistant Avatar */}
                      {message.type === MESSAGE_TYPES.ASSISTANT && (
                        <motion.div
                          className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg"
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaRobot className="text-base" />
                        </motion.div>
                      )}

                      {/* Message Bubble */}
                      <div className={`group max-w-[80%] ${message.type === MESSAGE_TYPES.USER ? 'text-right' : 'text-left'}`}>
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className={`inline-block p-4 rounded-2xl shadow-md active:shadow ${
                            message.type === MESSAGE_TYPES.USER
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm'
                              : message.type === MESSAGE_TYPES.ERROR
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-bl-sm border border-red-200 dark:border-red-800'
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700'
                          }`}
                          style={message.type === MESSAGE_TYPES.USER ? {
                            boxShadow: '0 10px 40px rgba(168, 85, 247, 0.4)',
                          } : {
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {/* Message Content */}
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </div>

                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((file, idx) => {
                                const FileIcon = getFileIcon(file.type);
                                return (
                                  <div
                                    key={idx}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                      message.type === MESSAGE_TYPES.USER
                                        ? 'bg-white/20'
                                        : 'bg-gray-50 dark:bg-gray-700'
                                    }`}
                                  >
                                    <FileIcon className="text-base flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{file.name}</p>
                                      <p className="text-xs opacity-70">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    {file.url && file.type.startsWith('image/') && (
                                      <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className={`mt-3 pt-3 border-t ${message.type === MESSAGE_TYPES.USER ? 'border-white/20' : 'border-gray-100 dark:border-gray-700'} flex flex-wrap gap-2`}>
                              {message.suggestions.map((suggestion, idx) => (
                                <motion.button
                                  key={idx}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    handleSuggestionClick(suggestion);
                                    hapticFeedback('light');
                                  }}
                                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                                    message.type === MESSAGE_TYPES.USER
                                      ? 'bg-white/20 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-sm'
                                      : 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800 dark:hover:to-pink-800 active:from-purple-300 active:to-pink-300 dark:active:from-purple-700 dark:active:to-pink-700 text-purple-700 dark:text-purple-300 shadow-sm'
                                  }`}
                                  style={{ touchAction: 'manipulation' }}
                                >
                                  {suggestion.text}
                                </motion.button>
                              ))}
                            </div>
                          )}

                          {/* Message Footer */}
                          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${message.type === MESSAGE_TYPES.USER ? 'border-white/20' : 'border-gray-100 dark:border-gray-700'}`}>
                            <p className={`text-xs ${message.type === MESSAGE_TYPES.USER ? 'text-purple-100/80' : 'text-gray-400 dark:text-gray-500'}`}>
                              {formatTimestamp(message.timestamp)}
                            </p>
                            
                            {/* Message Actions */}
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  copyMessage(message.content);
                                  hapticFeedback('light');
                                }}
                                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors"
                                style={{ touchAction: 'manipulation' }}
                              >
                                <FaCopy size={12} />
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  toggleBookmark(message.id);
                                  hapticFeedback('light');
                                }}
                                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors"
                                style={{ touchAction: 'manipulation' }}
                              >
                                {message.bookmarked ? <FaBookmark size={12} /> : <FaRegBookmark size={12} />}
                              </motion.button>

                              {message.type === MESSAGE_TYPES.ASSISTANT && (
                                <>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      addReaction(message.id, 'like');
                                      hapticFeedback('light');
                                    }}
                                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors"
                                    style={{ touchAction: 'manipulation' }}
                                  >
                                    <FaThumbsUp size={12} />
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      addReaction(message.id, 'dislike');
                                      hapticFeedback('light');
                                    }}
                                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors"
                                    style={{ touchAction: 'manipulation' }}
                                  >
                                    <FaThumbsDown size={12} />
                                  </motion.button>
                                </>
                              )}

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  shareMessage(message);
                                  hapticFeedback('light');
                                }}
                                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors"
                                style={{ touchAction: 'manipulation' }}
                              >
                                <FaShareAlt size={12} />
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  deleteMessage(message.id);
                                  hapticFeedback('light');
                                }}
                                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors"
                                style={{ touchAction: 'manipulation' }}
                              >
                                <FaTrash size={12} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* User Avatar */}
                      {message.type === MESSAGE_TYPES.USER && (
                        <motion.div
                          className="w-9 h-9 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 text-white flex items-center justify-center flex-shrink-0 shadow-lg"
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaUser className="text-base" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {state.isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2"
                    >
                      <motion.div
                        className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg"
                        animate={!settings.reduceMotion ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FaRobot className="text-base" />
                      </motion.div>
                      <div
                        className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 shadow-xl border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                              animate={!settings.reduceMotion ? { scale: [1, 1.3, 1], y: [0, -4, 0] } : {}}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ========== QUICK ACTIONS BAR ========== */}
                {filteredMessages.length === 0 && !state.isTyping && showQuickActions && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                        <FaLightbulb className="text-yellow-500" />
                        Quick actions:
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setShowQuickActions(false);
                          hapticFeedback('light');
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                    <div className="flex gap-2 pb-1">
                      {QUICK_ACTIONS.slice(0, mobile ? 3 : 6).map((action) => (
                        <motion.button
                          key={action.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            handleQuickAction(action);
                            hapticFeedback('light');
                          }}
                          className={`text-xs px-3 py-2 bg-gradient-to-r ${action.color} text-white rounded-xl transition-all shadow-md active:shadow border border-white/20 flex items-center gap-2 font-medium whitespace-nowrap flex-shrink-0`}
                          style={{ touchAction: 'manipulation' }}
                        >
                          <action.icon className="text-xs" />
                          {mobile ? action.shortText : action.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========== FILE PREVIEW ========== */}
                {selectedFiles.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, idx) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            {file.type.startsWith('image/') ? (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center">
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      removeFile(idx);
                                      hapticFeedback('light');
                                    }}
                                    className="text-white"
                                    style={{ touchAction: 'manipulation' }}
                                  >
                                    <FaTimes size={16} />
                                  </motion.button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-8">
                                <FileIcon className="text-blue-500 text-sm" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate max-w-[100px] dark:text-gray-200">{file.name}</p>
                                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    removeFile(idx);
                                    hapticFeedback('light');
                                  }}
                                  className="absolute top-1 right-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                  style={{ touchAction: 'manipulation' }}
                                >
                                  <FaTimes size={12} />
                                </motion.button>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========== INPUT AREA ========== */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                  <div className="flex items-end gap-2">
                    {/* Voice Input Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        handleVoiceInput();
                        hapticFeedback('medium');
                      }}
                      className={`p-3 rounded-2xl transition-all shadow-md flex-shrink-0 ${
                        isListening
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/30'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {isListening ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <FaStop className="text-base" />
                        </motion.div>
                      ) : (
                        <FaMicrophone className="text-base" />
                      )}
                    </motion.button>

                    {/* Input Field */}
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && !mobile) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder={
                          isListening 
                            ? "Listening..." 
                            : mode === CHAT_MODES.SEARCH 
                            ? "Search properties..."
                            : mode === CHAT_MODES.ANALYZE
                            ? "Ask about market trends..."
                            : mode === CHAT_MODES.PREDICT
                            ? "Request price prediction..."
                            : "Ask me anything..."
                        }
                        rows={1}
                        maxLength={MAX_MESSAGE_LENGTH}
                        disabled={state.isLoading || isListening}
                        className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-lg shadow-md text-sm text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          minHeight: '52px',
                          maxHeight: '120px',
                          touchAction: 'manipulation'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                      />

                      {/* Input Actions */}
                      <div className="absolute right-2 bottom-2 flex items-center gap-1">
                        {/* Camera Button (Mobile) */}
                        {mobile && (
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              cameraInputRef.current?.click();
                              hapticFeedback('light');
                            }}
                            disabled={selectedFiles.length >= MAX_FILES}
                            className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 active:text-purple-700 dark:active:text-purple-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <FaCamera className="text-base" />
                          </motion.button>
                        )}
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleCameraCapture}
                          className="hidden"
                        />

                        {/* File Attach */}
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            fileInputRef.current?.click();
                            hapticFeedback('light');
                          }}
                          disabled={selectedFiles.length >= MAX_FILES}
                          className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 active:text-purple-700 dark:active:text-purple-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <FaPaperclip className="text-base" />
                        </motion.button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        {/* Character Counter */}
                        {input.length > MAX_MESSAGE_LENGTH * 0.8 && (
                          <span className={`text-xs ${
                            characterCount > MAX_MESSAGE_LENGTH * 0.9 
                              ? 'text-red-500' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {characterCount}/{MAX_MESSAGE_LENGTH}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Send Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        handleSend();
                        hapticFeedback('medium');
                      }}
                      disabled={!isInputValid || state.isLoading}
                      className={`p-3 rounded-2xl transition-all shadow-md flex-shrink-0 ${
                        isInputValid && !state.isLoading
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 text-white shadow-purple-500/30'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {state.isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <FaSpinner className="text-base" />
                        </motion.div>
                      ) : (
                        <FaPaperPlane className="text-base" />
                      )}
                    </motion.button>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between mt-3 text-xs px-1">
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <FaMagic className="text-xs" />
                      AI-powered by HomeScape
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      {mode === CHAT_MODES.CHAT && 'Chat Mode'}
                      {mode === CHAT_MODES.SEARCH && 'Search Mode'}
                      {mode === CHAT_MODES.ANALYZE && 'Analysis Mode'}
                      {mode === CHAT_MODES.PREDICT && 'Prediction Mode'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles for scrollbar hiding */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .overscroll-contain {
          overscroll-behavior: contain;
        }
      `}</style>
    </>
  );
};

export default AIAssistant;
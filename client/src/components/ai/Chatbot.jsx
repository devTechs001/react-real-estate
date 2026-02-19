import { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaUser, 
  FaLightbulb, 
  FaHome, 
  FaChartLine, 
  FaSearch,
  FaMapMarkerAlt,
  FaDollarSign,
  FaHistory,
  FaThumbsUp,
  FaThumbsDown,
  FaRedo,
  FaEllipsisH,
  FaStar,
  FaRegStar,
  FaFile,
  FaMicrophone,
  FaSmile,
  FaGlobe,
  FaCalendar,
  FaFilter,
  FaCopy,
  FaDownload,
  FaPaperclip,
  FaImage,
  FaFileAlt,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

// ============================================
// CONSTANTS & CONFIGURATIONS
// ============================================

const CHAT_MODES = {
  NORMAL: 'normal',
  EXPERT: 'expert',
  QUICK: 'quick'
};

const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

const QUICK_SUGGESTIONS = [
  { id: 1, text: 'Show me homes under $500k', icon: <FaDollarSign />, category: 'price' },
  { id: 2, text: 'Best neighborhoods in Austin', icon: <FaMapMarkerAlt />, category: 'location' },
  { id: 3, text: 'Price prediction tool', icon: <FaChartLine />, category: 'tools' },
  { id: 4, text: 'Luxury properties', icon: <FaHome />, category: 'type' },
  { id: 5, text: 'First-time buyer guide', icon: <FaLightbulb />, category: 'help' },
  { id: 6, text: 'Investment properties', icon: <FaChartLine />, category: 'investment' }
];

const EMOJIS = ['😀', '😂', '😍', '👍', '👎', '❤️', '🔥', '✨', '🎉', '💡', '🏠', '💰', '🔑', '🌟', '👏'];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const TYPING_DELAY = 1500;
const MAX_MESSAGE_LENGTH = 2000;

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

const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return <FaImage />;
  if (fileType.startsWith('application/pdf')) return <FaFileAlt />;
  return <FaFile />;
};

const validateFile = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not supported.`);
  }
  return true;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy');
  }
};

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return null;
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
        conversationHistory: [...state.conversationHistory, action.payload]
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
        messages: [state.messages[0]], // Keep welcome message
        conversationHistory: []
      };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SUGGESTED_ACTIONS':
      return { ...state, suggestedActions: action.payload };
    
    default:
      return state;
  }
};

// ============================================
// MAIN CHATBOT COMPONENT
// ============================================

const ChatBot = () => {
  // ========== STATE MANAGEMENT ==========
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [
      {
        id: generateId(),
        role: MESSAGE_ROLES.ASSISTANT,
        content: "👋 Hello! I'm your AI real estate assistant. I can help you find properties, analyze market trends, estimate prices, and answer all your real estate questions. What would you like to know?",
        timestamp: new Date(),
        liked: null,
        saved: false,
        attachments: []
      }
    ],
    conversationHistory: [],
    isTyping: false,
    isLoading: false,
    suggestedActions: []
  });

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatMode, setChatMode] = useState(CHAT_MODES.NORMAL);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(new Audio('/sounds/notification.mp3'));

  // ========== EFFECTS ==========

  // Load saved messages on mount
  useEffect(() => {
    const savedMessages = loadFromLocalStorage('chatbot_messages');
    if (savedMessages && savedMessages.length > 1) {
      savedMessages.forEach(msg => {
        dispatch({ type: 'ADD_MESSAGE', payload: msg });
      });
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (state.messages.length > 1) {
      saveToLocalStorage('chatbot_messages', state.messages);
    }
  }, [state.messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isTyping]);

  // Track unread messages
  useEffect(() => {
    if (!isOpen && state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage.role === MESSAGE_ROLES.ASSISTANT) {
        setUnreadCount(prev => prev + 1);
        if (isSoundEnabled) {
          audioRef.current.play().catch(() => {}); // Play notification sound
        }
      }
    } else {
      setUnreadCount(0);
    }
  }, [state.messages, isOpen, isSoundEnabled]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // ========== AI RESPONSE LOGIC ==========

  const generateAIResponse = useCallback((userInput) => {
    const lowerInput = userInput.toLowerCase();
    let responseText = "";
    let newSuggestedActions = [];

    // Price-related queries
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('budget')) {
      responseText = "💰 **Price Analysis**\n\nBased on current market trends:\n• Average home price: $450,000\n• Price range for your search: $300k - $700k\n• Market appreciation: +5.2% YoY\n\nI can help you find properties within your budget and provide detailed price predictions. Would you like to see specific listings?";
      newSuggestedActions = [
        { text: 'Compare prices by area', icon: <FaChartLine /> },
        { text: 'Calculate affordability', icon: <FaDollarSign /> },
        { text: 'Get market report', icon: <FaFileAlt /> }
      ];
    }
    // Location queries
    else if (lowerInput.includes('neighborhood') || lowerInput.includes('area') || lowerInput.includes('location')) {
      responseText = "📍 **Neighborhood Insights**\n\nPopular areas include:\n• **Downtown**: Urban lifestyle, high walkability\n• **Riverside**: Family-friendly, top schools\n• **Tech District**: Modern amenities, young professionals\n\nEach has unique characteristics. What's most important to you?";
      newSuggestedActions = [
        { text: 'School ratings', icon: <FaGlobe /> },
        { text: 'Crime statistics', icon: <FaFilter /> },
        { text: 'Transportation access', icon: <FaMapMarkerAlt /> }
      ];
    }
    // Luxury properties
    else if (lowerInput.includes('luxury') || lowerInput.includes('expensive') || lowerInput.includes('premium')) {
      responseText = "✨ **Luxury Properties**\n\nOur premium listings feature:\n• High-end finishes & appliances\n• Gourmet kitchens\n• Smart home technology\n• Premium locations\n• Exclusive amenities\n\nTypical price range: $1M - $5M+\n\nWould you like to see our luxury portfolio?";
      newSuggestedActions = [
        { text: 'View luxury homes', icon: <FaHome /> },
        { text: 'Premium features', icon: <FaStar /> },
        { text: 'Virtual tours', icon: <FaImage /> }
      ];
    }
    // Rental queries
    else if (lowerInput.includes('rent') || lowerInput.includes('lease')) {
      responseText = "🏘️ **Rental Properties**\n\nCurrent rental market:\n• Average rent: $2,200/month\n• 1BR: $1,400 - $1,800\n• 2BR: $1,900 - $2,500\n• 3BR: $2,600 - $3,500\n\nI can help you find rentals matching your criteria and budget.";
      newSuggestedActions = [
        { text: 'Find rentals', icon: <FaHome /> },
        { text: 'Rent calculator', icon: <FaDollarSign /> },
        { text: 'Lease terms guide', icon: <FaFileAlt /> }
      ];
    }
    // Buying queries
    else if (lowerInput.includes('buy') || lowerInput.includes('purchase') || lowerInput.includes('mortgage')) {
      responseText = "🏡 **Home Buying Guide**\n\nI can assist you with:\n• Property search & filtering\n• Mortgage calculations\n• Market analysis\n• Neighborhood comparisons\n• Investment potential\n\nWhat's your target price range?";
      newSuggestedActions = [
        { text: 'Mortgage calculator', icon: <FaDollarSign /> },
        { text: 'Property search', icon: <FaSearch /> },
        { text: 'First-time buyer tips', icon: <FaLightbulb /> }
      ];
    }
    // Investment queries
    else if (lowerInput.includes('invest') || lowerInput.includes('roi') || lowerInput.includes('return')) {
      responseText = "📊 **Investment Analysis**\n\nKey metrics to consider:\n• Cap Rate: 5-8% (good range)\n• Cash-on-Cash Return: 8-12%\n• Appreciation potential\n• Rental demand\n• Tax benefits\n\nWould you like a detailed investment analysis for a specific property?";
      newSuggestedActions = [
        { text: 'ROI calculator', icon: <FaChartLine /> },
        { text: 'Investment properties', icon: <FaDollarSign /> },
        { text: 'Market trends', icon: <FaFilter /> }
      ];
    }
    // Help queries
    else if (lowerInput.includes('help') || lowerInput.includes('how') || lowerInput.includes('what')) {
      responseText = "ℹ️ **How I Can Help**\n\nI'm your AI real estate assistant! I can:\n\n✅ Search properties by location, price, size\n✅ Provide market insights & trends\n✅ Calculate mortgages & affordability\n✅ Compare neighborhoods\n✅ Answer real estate questions\n✅ Schedule viewings\n\nWhat would you like to explore?";
      newSuggestedActions = [
        { text: 'Start property search', icon: <FaSearch /> },
        { text: 'Market overview', icon: <FaChartLine /> },
        { text: 'Quick tips', icon: <FaLightbulb /> }
      ];
    }
    // Default response
    else {
      responseText = "I understand you're asking about real estate. I can help with:\n\n🏠 Property search\n💰 Price analysis\n📍 Neighborhood info\n📊 Market trends\n🔑 Buying/renting advice\n\nCould you provide more details about what you're looking for?";
      newSuggestedActions = [
        { text: 'Search properties', icon: <FaSearch /> },
        { text: 'Market analysis', icon: <FaChartLine /> },
        { text: 'Get started guide', icon: <FaLightbulb /> }
      ];
    }

    return { responseText, newSuggestedActions };
  }, []);

  // ========== MESSAGE HANDLERS ==========

  const handleSend = useCallback(async () => {
    if (!input.trim() || state.isLoading || input.length > MAX_MESSAGE_LENGTH) return;

    if (!isOnline) {
      toast.error('You are offline. Please check your internet connection.');
      return;
    }

    const userMessage = {
      id: generateId(),
      role: MESSAGE_ROLES.USER,
      content: input.trim(),
      timestamp: new Date(),
      liked: null,
      saved: false,
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

    try {
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));

      const { responseText, newSuggestedActions } = generateAIResponse(userMessage.content);

      const assistantMessage = {
        id: generateId(),
        role: MESSAGE_ROLES.ASSISTANT,
        content: responseText,
        timestamp: new Date(),
        liked: null,
        saved: false,
        attachments: []
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      dispatch({ type: 'SET_SUGGESTED_ACTIONS', payload: newSuggestedActions });

      if (isSoundEnabled) {
        audioRef.current.play().catch(() => {});
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: generateId(),
        role: MESSAGE_ROLES.ASSISTANT,
        content: "⚠️ I'm experiencing some technical difficulties. Please try again in a moment or rephrase your question.",
        timestamp: new Date(),
        liked: null,
        saved: false,
        attachments: []
      };

      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      toast.error('Failed to get response. Please try again.');
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [input, selectedFiles, state.isLoading, isOnline, isSoundEnabled, generateAIResponse]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...state.messages]
      .reverse()
      .find(msg => msg.role === MESSAGE_ROLES.USER);
    
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      inputRef.current?.focus();
    }
  }, [state.messages]);

  // ========== FEEDBACK HANDLERS ==========

  const handleFeedback = useCallback((messageId, liked) => {
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: { id: messageId, updates: { liked } }
    });

    if (liked) {
      toast.success('Thanks for the feedback! 👍');
    } else {
      toast('We\'ll try to improve! 💪', { icon: '🤔' });
    }
  }, []);

  const toggleSaveMessage = useCallback((messageId) => {
    const message = state.messages.find(msg => msg.id === messageId);
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: { id: messageId, updates: { saved: !message.saved } }
    });

    if (!message.saved) {
      toast.success('Message saved!');
    }
  }, [state.messages]);

  const copyMessage = useCallback((content) => {
    copyToClipboard(content);
  }, []);

  // ========== FILE HANDLERS ==========

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    try {
      files.forEach(validateFile);
      setSelectedFiles(prev => [...prev, ...files]);
      toast.success(`${files.length} file(s) attached`);
    } catch (error) {
      toast.error(error.message);
    }

    e.target.value = ''; // Reset input
  }, [selectedFiles]);

  const removeFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ========== CHAT MANAGEMENT ==========

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SET_SUGGESTED_ACTIONS', payload: [] });
    saveToLocalStorage('chatbot_messages', []);
    toast.success('Chat cleared');
    setShowOptionsMenu(false);
  }, []);

  const exportChat = useCallback(() => {
    const chatContent = state.messages
      .map(msg => `[${formatTimestamp(msg.timestamp)}] ${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homescape-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported!');
    setShowOptionsMenu(false);
  }, [state.messages]);

  const downloadMessage = useCallback((message) => {
    const blob = new Blob([message.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `message-${message.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Message downloaded!');
  }, []);

  // ========== SUGGESTION HANDLERS ==========

  const handleQuickSuggestion = useCallback((suggestion) => {
    setInput(suggestion.text);
    inputRef.current?.focus();
  }, []);

  const handleSuggestedAction = useCallback((action) => {
    setInput(action.text);
    inputRef.current?.focus();
    dispatch({ type: 'SET_SUGGESTED_ACTIONS', payload: [] });
  }, []);

  // ========== EMOJI HANDLERS ==========

  const insertEmoji = useCallback((emoji) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, []);

  // ========== VOICE RECORDING (Placeholder) ==========

  const toggleVoiceRecording = useCallback(() => {
    if (!isVoiceRecording) {
      setIsVoiceRecording(true);
      toast.success('Voice recording started...');
      // TODO: Implement actual voice recording
      setTimeout(() => {
        setIsVoiceRecording(false);
        setInput('Sample voice transcription');
        toast.success('Voice recorded!');
      }, 3000);
    } else {
      setIsVoiceRecording(false);
      toast('Recording cancelled');
    }
  }, [isVoiceRecording]);

  // ========== MEMOIZED VALUES ==========

  const characterCount = useMemo(() => input.length, [input]);
  const isInputValid = useMemo(() => input.trim().length > 0 && input.length <= MAX_MESSAGE_LENGTH, [input]);
  const savedMessages = useMemo(() => state.messages.filter(msg => msg.saved), [state.messages]);

  // ========== RENDER ==========

  return (
    <>
      {/* ========== FLOATING CHAT BUTTON ========== */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        {/* Pulse Effect */}
        <motion.div
          className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-75 blur-md"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white z-10 group overflow-hidden"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {/* Background Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="robot"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -180, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaRobot size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Badge */}
          {!isOpen && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg px-1.5"
            >
              <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </motion.div>
          )}

          {/* Offline Indicator */}
          {!isOnline && (
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-white" title="Offline" />
          )}
        </motion.button>

        {/* Keyboard Shortcut Hint */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-14 right-0 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Ctrl+K</kbd>
          </motion.div>
        )}
      </motion.div>

      {/* ========== CHAT WINDOW ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${
              isFullscreen 
                ? 'inset-4' 
                : 'bottom-24 right-6 w-[480px] max-w-[95vw] h-[600px]'
            } bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden`}
            style={{ maxHeight: isFullscreen ? '95vh' : '600px' }}
          >
            {/* ========== HEADER ========== */}
            <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <FaRobot size={22} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg leading-none mb-1">HomeScape AI</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-cyan-100">
                      {isOnline ? (state.isTyping ? 'Typing...' : 'Online • Ready to help') : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                {/* Sound Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title={isSoundEnabled ? 'Mute sounds' : 'Enable sounds'}
                >
                  {isSoundEnabled ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
                </motion.button>

                {/* Fullscreen Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                </motion.button>

                {/* Options Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Options menu"
                  >
                    <FaEllipsisH size={16} />
                  </motion.button>

                  <AnimatePresence>
                    {showOptionsMenu && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowOptionsMenu(false)}
                          className="fixed inset-0 z-40"
                        />

                        {/* Menu */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -10 }}
                          className="absolute right-0 top-12 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 w-56 z-50"
                        >
                          <button
                            onClick={() => { clearChat(); setShowOptionsMenu(false); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm transition-colors"
                          >
                            <FaRedo size={14} className="text-slate-400" />
                            <span>Clear chat history</span>
                          </button>
                          <button
                            onClick={() => { exportChat(); setShowOptionsMenu(false); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm transition-colors"
                          >
                            <FaDownload size={14} className="text-slate-400" />
                            <span>Export conversation</span>
                          </button>
                          <button
                            onClick={() => { retryLastMessage(); setShowOptionsMenu(false); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm transition-colors"
                          >
                            <FaHistory size={14} className="text-slate-400" />
                            <span>Retry last message</span>
                          </button>
                          
                          <div className="border-t border-slate-200 my-2" />
                          
                          <div className="px-4 py-1.5">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Chat Mode</p>
                          </div>
                          
                          {Object.values(CHAT_MODES).map(mode => (
                            <button
                              key={mode}
                              onClick={() => { setChatMode(mode); setShowOptionsMenu(false); }}
                              className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-sm transition-colors ${
                                chatMode === mode ? 'bg-blue-50 text-blue-600' : ''
                              }`}
                            >
                              <span className="capitalize">{mode} Mode</span>
                              {chatMode === mode && <FaCheckCircle size={14} />}
                            </button>
                          ))}

                          {savedMessages.length > 0 && (
                            <>
                              <div className="border-t border-slate-200 my-2" />
                              <div className="px-4 py-2.5">
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                  <FaStar className="text-yellow-500" size={12} />
                                  {savedMessages.length} saved message{savedMessages.length > 1 ? 's' : ''}
                                </p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>
            </div>

            {/* ========== MESSAGES CONTAINER ========== */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
              {state.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`flex gap-3 ${message.role === MESSAGE_ROLES.USER ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {message.role === MESSAGE_ROLES.ASSISTANT && (
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <FaRobot size={18} />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`group max-w-[75%] ${message.role === MESSAGE_ROLES.USER ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-4 rounded-2xl shadow-md ${
                        message.role === MESSAGE_ROLES.USER
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                          : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>

                      {/* Attachments */}
                      {message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 p-2 rounded-lg ${
                                message.role === MESSAGE_ROLES.USER
                                  ? 'bg-white/20'
                                  : 'bg-slate-50'
                              }`}
                            >
                              <span className="text-lg">{getFileIcon(file.type)}</span>
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
                          ))}
                        </div>
                      )}

                      {/* Message Footer */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/10">
                        <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                        
                        {/* Message Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyMessage(message.content)}
                            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
                            title="Copy message"
                          >
                            <FaCopy size={11} />
                          </motion.button>

                          {message.role === MESSAGE_ROLES.ASSISTANT && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleFeedback(message.id, true)}
                                className={`p-1.5 rounded-full transition-all ${
                                  message.liked === true 
                                    ? 'text-green-600 bg-green-100' 
                                    : 'hover:bg-black/10'
                                }`}
                                title="Helpful"
                              >
                                <FaThumbsUp size={11} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleFeedback(message.id, false)}
                                className={`p-1.5 rounded-full transition-all ${
                                  message.liked === false 
                                    ? 'text-red-600 bg-red-100' 
                                    : 'hover:bg-black/10'
                                }`}
                                title="Not helpful"
                              >
                                <FaThumbsDown size={11} />
                              </motion.button>
                            </>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleSaveMessage(message.id)}
                            className={`p-1.5 rounded-full transition-all ${
                              message.saved 
                                ? 'text-yellow-600 bg-yellow-100' 
                                : 'hover:bg-black/10'
                            }`}
                            title={message.saved ? 'Unsave' : 'Save'}
                          >
                            {message.saved ? <FaStar size={11} /> : <FaRegStar size={11} />}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadMessage(message)}
                            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
                            title="Download"
                          >
                            <FaDownload size={11} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Avatar */}
                  {message.role === MESSAGE_ROLES.USER && (
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <FaUser size={18} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {state.isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                    <FaRobot size={18} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-md border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested Actions */}
              {state.suggestedActions.length > 0 && !state.isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pl-13"
                >
                  {state.suggestedActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestedAction(action)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 px-3 py-2 rounded-full text-xs font-medium transition-all shadow-sm border border-blue-200/50"
                    >
                      <span className="text-base">{action.icon}</span>
                      <span>{action.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ========== QUICK SUGGESTIONS ========== */}
            {state.messages.length <= 1 && !state.isTyping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white"
              >
                <p className="text-xs text-slate-600 font-semibold mb-3 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" size={14} />
                  Try asking about:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                    <motion.button
                      key={suggestion.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="flex items-center gap-2 p-2.5 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-slate-700 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-left shadow-sm"
                    >
                      <span className="text-lg">{suggestion.icon}</span>
                      <span className="text-xs font-medium leading-tight">{suggestion.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ========== FILE PREVIEW ========== */}
            {selectedFiles.length > 0 && (
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      {file.type.startsWith('image/') ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFile(idx)}
                              className="text-white"
                            >
                              <FaTimes size={16} />
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8">
                          <span className="text-blue-500">{getFileIcon(file.type)}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate max-w-[100px]">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFile(idx)}
                            className="absolute top-1 right-1 text-slate-400 hover:text-red-500"
                          >
                            <FaTimes size={12} />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ========== INPUT AREA ========== */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-2">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                      isOnline 
                        ? "Ask about properties, prices, neighborhoods..." 
                        : "You're offline. Connect to send messages."
                    }
                    rows={input.split('\n').length > 2 ? 3 : 1}
                    maxLength={MAX_MESSAGE_LENGTH}
                    disabled={state.isLoading || !isOnline}
                    className="w-full px-4 py-3 pr-32 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50 text-slate-900 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />

                  {/* Input Toolbar */}
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    {/* Emoji Picker */}
                    <div className="relative">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Insert emoji"
                      >
                        <FaSmile size={16} />
                      </motion.button>

                      {/* Emoji Picker Dropdown */}
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setShowEmojiPicker(false)}
                              className="fixed inset-0 z-40"
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-12 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 grid grid-cols-5 gap-2 z-50"
                            >
                              {EMOJIS.map((emoji, idx) => (
                                <motion.button
                                  key={idx}
                                  type="button"
                                  whileHover={{ scale: 1.3, backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => insertEmoji(emoji)}
                                  className="p-2 hover:bg-slate-100 rounded-lg text-xl transition-colors"
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* File Attachment */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Attach file"
                      disabled={selectedFiles.length >= MAX_FILES}
                    >
                      <FaPaperclip size={16} />
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Voice Recording */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVoiceRecording}
                      className={`p-2 rounded-full transition-all ${
                        isVoiceRecording
                          ? 'text-red-600 bg-red-50 animate-pulse'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title={isVoiceRecording ? 'Stop recording' : 'Voice input'}
                    >
                      <FaMicrophone size={16} />
                    </motion.button>

                    {/* Send Button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!isInputValid || state.isLoading || !isOnline}
                      className={`p-2.5 rounded-full transition-all ${
                        isInputValid && !state.isLoading && isOnline
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      title="Send message"
                    >
                      {state.isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <FaSpinner size={16} />
                        </motion.div>
                      ) : (
                        <FaPaperPlane size={16} />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Character Counter & Hints */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {!isOnline && (
                      <span className="text-amber-600 flex items-center gap-1">
                        <FaExclamationCircle size={12} />
                        You're offline
                      </span>
                    )}
                    {isVoiceRecording && (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-red-600 flex items-center gap-1"
                      >
                        <span className="w-2 h-2 bg-red-600 rounded-full" />
                        Recording...
                      </motion.span>
                    )}
                  </div>
                  <span className={`${
                    characterCount > MAX_MESSAGE_LENGTH * 0.9 ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {characterCount}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
              </form>

              <p className="text-xs text-slate-400 mt-2 text-center">
                AI-powered by HomeScape • {chatMode === CHAT_MODES.EXPERT && 'Expert Mode'} 
                {chatMode === CHAT_MODES.NORMAL && 'Conversational Mode'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
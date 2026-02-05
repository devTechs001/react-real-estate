import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaSpinner
} from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [context, setContext] = useState(null);
  const [mode, setMode] = useState('chat'); // chat, search, analyze
  
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition failed');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Load chat history
    loadChatHistory();

    // Set initial suggestions
    setSuggestions(getInitialSuggestions());

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = () => {
    const history = localStorage.getItem('aiChatHistory');
    if (history) {
      setMessages(JSON.parse(history).slice(-20)); // Keep last 20 messages
    }
  };

  const saveChatHistory = (newMessages) => {
    localStorage.setItem('aiChatHistory', JSON.stringify(newMessages));
  };

  const getInitialSuggestions = () => [
    { icon: FaHome, text: "Find properties near me", action: "search" },
    { icon: FaDollarSign, text: "Predict property price", action: "predict" },
    { icon: FaChartLine, text: "Show market trends", action: "trends" },
    { icon: FaQuestionCircle, text: "How can I help you?", action: "help" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await processMessage(input);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        data: response.data,
        suggestions: response.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, aiMessage];
        saveChatHistory(updated);
        return updated;
      });

      if (!isMuted && response.speak) {
        speak(response.content);
      }

      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process your request');
    } finally {
      setIsTyping(false);
    }
  };

  const processMessage = async (message) => {
    // Detect intent
    const intent = await detectIntent(message);
    
    switch (intent.type) {
      case 'property_search':
        return await handlePropertySearch(intent.parameters);
      
      case 'price_prediction':
        return await handlePricePrediction(intent.parameters);
      
      case 'market_analysis':
        return await handleMarketAnalysis(intent.parameters);
      
      case 'property_info':
        return await handlePropertyInfo(intent.parameters);
      
      case 'general_help':
        return handleGeneralHelp();
      
      default:
        return await handleGeneralQuery(message);
    }
  };

  const detectIntent = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Property search patterns
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || 
        lowerMessage.includes('show') || lowerMessage.includes('properties')) {
      return {
        type: 'property_search',
        parameters: extractSearchParameters(message)
      };
    }
    
    // Price prediction patterns
    if (lowerMessage.includes('price') || lowerMessage.includes('value') || 
        lowerMessage.includes('worth') || lowerMessage.includes('predict')) {
      return {
        type: 'price_prediction',
        parameters: extractPriceParameters(message)
      };
    }
    
    // Market analysis patterns
    if (lowerMessage.includes('market') || lowerMessage.includes('trend') || 
        lowerMessage.includes('analysis')) {
      return {
        type: 'market_analysis',
        parameters: extractMarketParameters(message)
      };
    }
    
    // Help patterns
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || 
        lowerMessage.includes('what can you')) {
      return { type: 'general_help', parameters: {} };
    }
    
    return { type: 'general', parameters: {} };
  };

  const extractSearchParameters = (message) => {
    const params = {};
    
    // Extract location
    const locationMatch = message.match(/in\s+([A-Za-z\s]+)(?:\s|$)/i);
    if (locationMatch) params.location = locationMatch[1].trim();
    
    // Extract property type
    const types = ['apartment', 'house', 'villa', 'condo', 'studio'];
    types.forEach(type => {
      if (message.toLowerCase().includes(type)) {
        params.propertyType = type;
      }
    });
    
    // Extract bedrooms
    const bedroomMatch = message.match(/(\d+)\s*(?:bed|bedroom)/i);
    if (bedroomMatch) params.bedrooms = parseInt(bedroomMatch[1]);
    
    // Extract price range
    const priceMatch = message.match(/(\d+)k?\s*(?:to|-)\s*(\d+)k?/i);
    if (priceMatch) {
      params.minPrice = parseInt(priceMatch[1]) * (message.includes('k') ? 1000 : 1);
      params.maxPrice = parseInt(priceMatch[2]) * (message.includes('k') ? 1000 : 1);
    }
    
    return params;
  };

  const extractPriceParameters = (message) => {
    return extractSearchParameters(message); // Reuse search parameter extraction
  };

  const extractMarketParameters = (message) => {
    const params = {};
    
    // Extract location
    const locationMatch = message.match(/(?:in|for)\s+([A-Za-z\s]+)(?:\s|$)/i);
    if (locationMatch) params.location = locationMatch[1].trim();
    
    return params;
  };

  const handlePropertySearch = async (parameters) => {
    const results = await aiService.searchProperties(parameters);
    
    return {
      content: `I found ${results.length} properties matching your criteria.`,
      data: results,
      suggestions: [
        { text: "Show more details", action: "details" },
        { text: "Refine search", action: "refine" },
        { text: "Save search", action: "save" }
      ],
      speak: true
    };
  };

  const handlePricePrediction = async (parameters) => {
    const prediction = await aiService.predictPrice(parameters);
    
    return {
      content: `Based on my analysis, the estimated value is ${formatPrice(prediction.price)} with ${prediction.confidence}% confidence.`,
      data: prediction,
      suggestions: [
        { text: "View market trends", action: "trends" },
        { text: "Compare properties", action: "compare" },
        { text: "Get detailed report", action: "report" }
      ],
      speak: true
    };
  };

  const handleMarketAnalysis = async (parameters) => {
    const analysis = await aiService.getMarketAnalysis(parameters);
    
    return {
      content: `Here's the market analysis for ${parameters.location || 'your area'}.`,
      data: analysis,
      suggestions: [
        { text: "View predictions", action: "predict" },
        { text: "Compare areas", action: "compare" },
        { text: "Investment opportunities", action: "invest" }
      ],
      speak: true
    };
  };

  const handlePropertyInfo = async (parameters) => {
    const info = await aiService.getPropertyInfo(parameters.propertyId);
    
    return {
      content: `Here's the information about this property.`,
      data: info,
      suggestions: [
        { text: "Schedule viewing", action: "schedule" },
        { text: "Contact seller", action: "contact" },
        { text: "Similar properties", action: "similar" }
      ],
      speak: true
    };
  };

  const handleGeneralHelp = () => {
    return {
      content: `I'm your AI real estate assistant! I can help you:
        • Search for properties
        • Predict property prices
        • Analyze market trends
        • Answer questions about listings
        • Schedule viewings
        • And much more!
        
        Just ask me anything about real estate!`,
      suggestions: getInitialSuggestions(),
      speak: true
    };
  };

  const handleGeneralQuery = async (message) => {
    const response = await aiService.askQuestion(message);
    
    return {
      content: response.answer,
      data: response.data,
      suggestions: response.suggestions || getInitialSuggestions(),
      speak: true
    };
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      synthRef.current.cancel();
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion.text);
    await handleSend();
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('aiChatHistory');
    toast.success('Chat history cleared');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white hover:shadow-3xl transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <FaRobot className="text-2xl" />
            </motion.div>

            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-75"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed z-50 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden ${
              isExpanded
                ? 'inset-4'
                : 'bottom-6 right-6 w-96 h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <FaRobot className="text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online • Always here to help
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Toggle sound"
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <FaCompress /> : <FaExpand />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <FaHistory />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Close"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('chat')}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1 ${
                    mode === 'chat'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FaRobot className="text-xs" />
                  Chat
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('search')}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1 ${
                    mode === 'search'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FaSearch className="text-xs" />
                  Search
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('analyze')}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1 ${
                    mode === 'analyze'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FaChartLine className="text-xs" />
                  Analyze
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-white/10" style={{ height: isExpanded ? 'calc(100% - 200px)' : '380px' }}>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaRobot className="text-6xl text-blue-400 mx-auto mb-4" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-semibold text-gray-800 mb-2"
                  >
                    Hello! I'm your AI Assistant
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-600 mb-6"
                  >
                    Ask me anything about real estate, properties, or market trends
                  </motion.p>

                  {/* Suggestions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 gap-2"
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center justify-center gap-2 p-3 bg-white/80 hover:bg-white rounded-lg text-left text-sm transition-all shadow-sm backdrop-blur-sm border border-white/50"
                      >
                        {suggestion.icon && <suggestion.icon className="text-blue-600" />}
                        <span className="text-gray-700">{suggestion.text}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-2 shadow-lg">
                          <FaRobot size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-l-2xl rounded-tr-2xl shadow-lg'
                            : 'bg-white/90 text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-lg border border-white/50'
                        } p-4 backdrop-blur-sm`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                        {/* Display data if available */}
                        {message.data && (
                          <div className={`mt-3 pt-3 border-t ${message.type === 'user' ? 'border-white/20' : 'border-gray-200/50'}`}>
                            {/* Render data based on type */}
                            {Array.isArray(message.data) ? (
                              <div className="space-y-2">
                                {message.data.slice(0, 3).map((item, idx) => (
                                  <div key={idx} className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>
                                    {item.title || item.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>
                                {JSON.stringify(message.data, null, 2)}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className={`mt-3 pt-3 border-t ${message.type === 'user' ? 'border-white/20' : 'border-gray-200/50'} flex flex-wrap gap-2`}>
                            {message.suggestions.map((suggestion, idx) => (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                                  message.type === 'user'
                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                }`}
                              >
                                {suggestion.text}
                              </motion.button>
                            ))}
                          </div>
                        )}

                        <p className={`text-xs ${message.type === 'user' ? 'text-blue-100/80' : 'text-gray-500'} mt-2`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full flex items-center justify-center flex-shrink-0 ml-2 shadow-lg">
                          <FaUser size={14} />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-2 shadow-lg">
                        <FaRobot size={14} />
                      </div>
                      <div className="bg-white/90 rounded-2xl p-4 flex items-center gap-2 shadow-lg border border-white/50 backdrop-blur-sm">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/20 bg-white/50 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-full transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <FaStop /> : <FaMicrophone />}
                </motion.button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Ask me anything about real estate...`}
                    className="w-full px-4 py-3 pl-4 pr-12 bg-white/90 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg shadow-sm text-sm text-gray-900 backdrop-blur-sm border border-gray-200/50"
                  />

                  {/* Send button inside input */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                      input.trim() && !isTyping
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isTyping ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  </motion.button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[
                  { text: 'Find properties near me', icon: <FaLightbulb />, action: () => setInput('Find properties near me') },
                  { text: 'Show market trends', icon: <FaChartLine />, action: () => setInput('Show market trends') },
                  { text: 'Help me find my dream home', icon: <FaHome />, action: () => setInput('Help me find my dream home') }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="text-xs px-3 py-1.5 bg-white/80 hover:bg-white rounded-full transition-all shadow-sm backdrop-blur-sm border border-white/50 flex items-center gap-1"
                  >
                    {action.icon}
                    <span>{action.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
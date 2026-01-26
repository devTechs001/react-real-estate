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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full shadow-2xl flex items-center justify-center text-white"
          >
            <FaRobot className="text-2xl" />
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
            className={`fixed z-50 bg-white rounded-2xl shadow-2xl ${
              isExpanded 
                ? 'inset-4' 
                : 'bottom-6 right-6 w-96 h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaRobot className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isExpanded ? <FaCompress /> : <FaExpand />}
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaHistory />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setMode('chat')}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    mode === 'chat' 
                      ? 'bg-white text-primary-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setMode('search')}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    mode === 'search' 
                      ? 'bg-white text-primary-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FaSearch className="inline mr-1" />
                  Search
                </button>
                <button
                  onClick={() => setMode('analyze')}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    mode === 'analyze' 
                      ? 'bg-white text-primary-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FaChartLine className="inline mr-1" />
                  Analyze
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: isExpanded ? 'calc(100% - 200px)' : '380px' }}>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <FaRobot className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Hello! I'm your AI Assistant
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Ask me anything about real estate, properties, or market trends
                  </p>
                  
                  {/* Suggestions */}
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"
                      >
                        {suggestion.icon && <suggestion.icon className="text-primary-600" />}
                        <span className="text-gray-700">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white rounded-l-2xl rounded-tr-2xl'
                            : 'bg-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl'
                        } p-4`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Display data if available */}
                        {message.data && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            {/* Render data based on type */}
                            {Array.isArray(message.data) ? (
                              <div className="space-y-2">
                                {message.data.slice(0, 3).map((item, index) => (
                                  <div key={index} className="text-xs opacity-90">
                                    {item.title || item.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs opacity-90">
                                {JSON.stringify(message.data, null, 2)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                              >
                                {suggestion.text}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-2">
                        <FaSpinner className="animate-spin text-primary-600" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {isListening ? <FaStop /> : <FaMicrophone />}
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Ask me anything about real estate...`}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className={`p-3 rounded-lg transition-all ${
                    input.trim() && !isTyping
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isTyping ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => setInput('Find properties near me')}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaLightbulb className="inline mr-1" />
                  Near me
                </button>
                <button
                  onClick={() => setInput('Show market trends')}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaChartLine className="inline mr-1" />
                  Trends
                </button>
                <button
                  onClick={() => setInput('Help me find my dream home')}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaHome className="inline mr-1" />
                  Dream home
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
import { useState, useRef, useEffect } from 'react';
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
  FaBookmark,
  FaRegBookmark,
  FaImage,
  FaFile,
  FaMicrophone,
  FaSmile,
  FaGlobe,
  FaCalendar,
  FaFilter,
  FaSort
} from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI real estate assistant. How can I help you find your dream property today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liked: null,
      saved: false,
      attachments: []
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [chatMode, setChatMode] = useState('normal'); // normal, expert, quick
  const [suggestedActions, setSuggestedActions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liked: null,
      saved: false,
      attachments: selectedFiles
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setInput('');
    setSelectedFiles([]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate API call with realistic delay
      setTimeout(async () => {
        try {
          // Simulate different responses based on user input
          let responseText = "";
          let newSuggestedActions = [];
          const lowerInput = input.toLowerCase();
          
          if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('budget')) {
            responseText = "I can help you with property pricing! Based on current market trends, properties in your desired range typically range from $300k-$700k depending on location and features. Would you like me to search for specific properties?";
            newSuggestedActions = [
              { text: 'Compare prices', icon: <FaChartLine /> },
              { text: 'Get market report', icon: <FaFile /> },
              { text: 'Schedule viewing', icon: <FaCalendar /> }
            ];
          } else if (lowerInput.includes('neighborhood') || lowerInput.includes('area') || lowerInput.includes('location')) {
            responseText = "Great question! Popular neighborhoods include downtown areas with easy commutes, suburban communities with good schools, and waterfront properties. What type of area are you most interested in?";
            newSuggestedActions = [
              { text: 'School ratings', icon: <FaGlobe /> },
              { text: 'Crime rates', icon: <FaFilter /> },
              { text: 'Transport links', icon: <FaMapMarkerAlt /> }
            ];
          } else if (lowerInput.includes('luxury') || lowerInput.includes('expensive')) {
            responseText = "Luxury properties often feature high-end finishes, premium locations, and exclusive amenities. I can filter properties with features like granite countertops, hardwood floors, and designer fixtures.";
            newSuggestedActions = [
              { text: 'View luxury homes', icon: <FaHome /> },
              { text: 'Premium features', icon: <FaStar /> },
              { text: 'Exclusive listings', icon: <FaBookmark /> }
            ];
          } else if (lowerInput.includes('rent') || lowerInput.includes('lease')) {
            responseText = "For rental properties, I can help you find options based on your budget, preferred location, and amenities. Would you like to see available rentals in a specific area?";
            newSuggestedActions = [
              { text: 'Find rentals', icon: <FaHome /> },
              { text: 'Calculate rent', icon: <FaDollarSign /> },
              { text: 'Tenant screening', icon: <FaUser /> }
            ];
          } else if (lowerInput.includes('buy') || lowerInput.includes('purchase')) {
            responseText = "Buying a home is an exciting process! I can help you find properties that match your criteria, estimate mortgage payments, and provide market insights. What's your target price range?";
            newSuggestedActions = [
              { text: 'Mortgage calculator', icon: <FaDollarSign /> },
              { text: 'Property search', icon: <FaSearch /> },
              { text: 'Neighborhood guide', icon: <FaMapMarkerAlt /> }
            ];
          } else {
            responseText = "I can help you find properties based on your preferences. I can assist with location recommendations, price analysis, neighborhood insights, and property comparisons. What would you like to know?";
            newSuggestedActions = [
              { text: 'Property search', icon: <FaSearch /> },
              { text: 'Market trends', icon: <FaChartLine /> },
              { text: 'Neighborhood info', icon: <FaMapMarkerAlt /> }
            ];
          }

          setSuggestedActions(newSuggestedActions);

          const assistantMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            liked: null,
            saved: false,
            attachments: []
          };

          setMessages(prev => [...prev, assistantMessage]);
          setConversationHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
          const errorMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: "I'm having trouble connecting right now. Could you try again?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            liked: null,
            saved: false,
            attachments: []
          };
          setMessages(prev => [...prev, errorMessage]);
          setConversationHistory(prev => [...prev, errorMessage]);
        } finally {
          setIsTyping(false);
          setIsLoading(false);
        }
      }, 1500);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    { text: 'Show me homes under $500k', icon: <FaDollarSign className="text-blue-500" /> },
    { text: 'Best neighborhoods in Austin', icon: <FaMapMarkerAlt className="text-green-500" /> },
    { text: 'Price prediction tool', icon: <FaChartLine className="text-purple-500" /> },
    { text: 'Luxury properties', icon: <FaHome className="text-orange-500" /> },
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion.text);
  };

  const handleFeedback = (messageId, liked) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, liked } : msg
      )
    );
    
    if (liked) {
      toast.success('Thanks for the positive feedback!');
    } else {
      toast('How can I improve?', { icon: '🤔' });
    }
  };

  const toggleSaveMessage = (messageId) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, saved: !msg.saved } : msg
      )
    );
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your AI real estate assistant. How can I help you find your dream property today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        liked: null,
        saved: false,
        attachments: []
      }
    ]);
    setSuggestedActions([]);
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => `[${msg.timestamp}] ${msg.role}: ${msg.content}`).join('\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully!');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const insertEmoji = (emoji) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '😍', '👍', '👎', '❤️', '🔥', '✨', '🎉', '💡'];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      >
        {/* Pulse animation behind button */}
        <motion.div
          className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur-sm"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center border-4 border-white z-10 group"
        >
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

          {/* Notification badge */}
          {!isOpen && (
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            >
              <span className="text-xs text-white font-bold">!</span>
            </motion.div>
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 0 : 5 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isOpen ? '' : 'AI Assistant'}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 100,
              scale: 0.8,
              x: '100%'
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              x: '0%'
            }}
            exit={{
              opacity: 0,
              y: 100,
              scale: 0.8,
              x: '100%'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="fixed bottom-24 right-6 w-[500px] max-w-[95vw] h-[550px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-2xl z-50 flex flex-col border border-white/20 backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <FaRobot size={20} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">RealEstate AI Assistant</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    title="Options"
                  >
                    <FaEllipsisH size={14} />
                  </motion.button>

                  {/* Options Menu */}
                  <AnimatePresence>
                    {showOptionsMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        className="absolute right-0 top-10 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-10"
                      >
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                          onClick={() => { clearChat(); setShowOptionsMenu(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <FaRedo size={12} /> Clear chat
                        </motion.button>
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                          onClick={() => { exportChat(); setShowOptionsMenu(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <FaHistory size={12} /> Export chat
                        </motion.button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(224, 231, 255, 1)', color: '#2563eb' }}
                          onClick={() => { setChatMode('normal'); setShowOptionsMenu(false); }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm ${chatMode === 'normal' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                          <FaSearch size={12} /> Normal Mode
                        </motion.button>
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(224, 231, 255, 1)', color: '#2563eb' }}
                          onClick={() => { setChatMode('expert'); setShowOptionsMenu(false); }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm ${chatMode === 'expert' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                          <FaChartLine size={12} /> Expert Mode
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes size={16} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-white/10">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaRobot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-2xl rounded-tl-none ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-br-none shadow-lg'
                        : 'bg-white/90 text-gray-800 rounded-bl-none shadow-lg border border-white/50'
                    } backdrop-blur-sm`}
                  >
                    <p className="text-sm">{message.content}</p>

                    {/* Message attachments */}
                    {message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.attachments.map((file, idx) => (
                          <div key={idx} className="bg-white/20 rounded-lg px-2 py-1 text-xs flex items-center gap-1">
                            <FaFile size={10} />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">{message.timestamp}</p>
                      <div className="flex gap-1">
                        {message.role === 'assistant' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleFeedback(message.id, true)}
                              className={`p-1 rounded-full transition-colors ${
                                message.liked === true ? 'text-green-600 bg-green-100' : 'text-gray-400 hover:text-green-600'
                              }`}
                              title="Helpful"
                            >
                              <FaThumbsUp size={12} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleFeedback(message.id, false)}
                              className={`p-1 rounded-full transition-colors ${
                                message.liked === false ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-600'
                              }`}
                              title="Not helpful"
                            >
                              <FaThumbsDown size={12} />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSaveMessage(message.id)}
                          className={`p-1 rounded-full transition-colors ${
                            message.saved ? 'text-yellow-600 bg-yellow-100' : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={message.saved ? "Unsave" : "Save"}
                        >
                          {message.saved ? <FaStar size={12} /> : <FaRegStar size={12} />}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaUser size={18} />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    <FaRobot size={18} />
                  </div>
                  <div className="bg-white/90 p-4 rounded-2xl rounded-bl-none shadow-lg border border-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested actions */}
              {suggestedActions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {suggestedActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(action.text)}
                      className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-xs transition-colors shadow-sm"
                    >
                      <span>{action.icon}</span>
                      <span>{action.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 border-t border-gray-200/50 bg-white/50"
              >
                <p className="text-xs text-gray-600 font-medium mb-2 flex items-center gap-1">
                  <FaLightbulb className="text-yellow-500" size={12} />
                  Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="text-xs bg-white/80 hover:bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200/50 transition-all flex items-center gap-1 shadow-sm backdrop-blur-sm"
                    >
                      <span>{suggestion.icon}</span>
                      <span>{suggestion.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Attachment preview */}
            {selectedFiles.length > 0 && (
              <div className="p-2 border-t border-gray-200/50 bg-white/50 flex flex-wrap gap-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    <FaFile size={10} />
                    <span>{file.name}</span>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </motion.button>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200/50 bg-white/70 backdrop-blur-sm">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about properties, prices, or locations..."
                    className="w-full px-4 py-3 pr-24 border border-gray-300/50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm shadow-sm text-gray-900"
                    disabled={isLoading}
                  />

                  {/* Input toolbar */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Emojis"
                    >
                      <FaSmile size={14} />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => document.getElementById('file-upload').click()}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Attach file"
                    >
                      <FaPaperPlane size={14} />
                    </motion.button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
                >
                  <FaPaperPlane size={16} />
                </motion.button>
              </form>

              {/* Emoji picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-20 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-2 grid grid-cols-5 gap-1"
                  >
                    {emojis.map((emoji, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.2, backgroundColor: 'rgba(243, 244, 246, 1)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-gray-100 rounded text-lg"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-gray-500 mt-2 text-center">
                AI Assistant • Responses are simulated
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
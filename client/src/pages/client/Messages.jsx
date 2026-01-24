import { useState, useEffect } from 'react';
import { FaEnvelope, FaPaperPlane, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const { data } = await api.post('/messages', {
        conversationId: selectedConversation._id,
        content: newMessage,
      });
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="Messages" description="Your conversations" />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaEnvelope className="inline mr-3" />
            Messages
          </h1>
          <p className="text-xl">Communicate with property owners</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No messages yet</h3>
            <p className="text-gray-600">
              Start a conversation by inquiring about a property
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-primary-600 text-white">
                <h3 className="font-semibold">Conversations</h3>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{conversation.otherUser.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col">
              {selectedConversation && (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{selectedConversation.otherUser.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.property?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.isMine
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="btn btn-primary"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;

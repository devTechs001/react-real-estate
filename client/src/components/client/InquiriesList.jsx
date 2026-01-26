// client/src/pages/user/Inquiries.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const data = [
      {
        id: 1,
        property: {
          id: 1,
          title: 'Luxury Waterfront Villa',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
          price: 2500000
        },
        agent: {
          name: 'Sarah Mitchell',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          online: true
        },
        status: 'active',
        unread: 2,
        lastMessage: 'Thank you for your interest! The property is still available...',
        updatedAt: '2024-01-15T10:30:00',
        messages: [
          { id: 1, from: 'user', text: "Hi, I'm interested in this property. Is it still available?", time: '2024-01-15 10:00' },
          { id: 2, from: 'agent', text: 'Hello! Yes, the property is still available. Would you like to schedule a viewing?', time: '2024-01-15 10:15' },
          { id: 3, from: 'user', text: 'That would be great! What times are available this week?', time: '2024-01-15 10:20' },
          { id: 4, from: 'agent', text: 'We have openings on Thursday at 2 PM or Saturday at 11 AM. Which works better for you?', time: '2024-01-15 10:30' },
        ]
      },
      {
        id: 2,
        property: {
          id: 2,
          title: 'Modern Downtown Penthouse',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
          price: 1800000
        },
        agent: {
          name: 'John Anderson',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          online: false
        },
        status: 'pending',
        unread: 0,
        lastMessage: 'Can you provide more details about the HOA fees?',
        updatedAt: '2024-01-10T14:00:00',
        messages: [
          { id: 1, from: 'user', text: 'Can you provide more details about the HOA fees?', time: '2024-01-10 14:00' },
        ]
      },
      {
        id: 3,
        property: {
          id: 3,
          title: 'Cozy Mountain Cabin',
          image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
          price: 450000
        },
        agent: {
          name: 'Emily Davis',
          image: 'https://randomuser.me/api/portraits/women/68.jpg',
          online: true
        },
        status: 'closed',
        unread: 0,
        lastMessage: 'Thank you for considering this property!',
        updatedAt: '2024-01-05T16:00:00',
        messages: [
          { id: 1, from: 'user', text: 'Is this property pet-friendly?', time: '2024-01-05 15:00' },
          { id: 2, from: 'agent', text: 'Yes, the property allows pets. There are no restrictions.', time: '2024-01-05 15:30' },
          { id: 3, from: 'user', text: "Great, but I've decided to go with another property. Thanks!", time: '2024-01-05 15:45' },
          { id: 4, from: 'agent', text: 'Thank you for considering this property! Best of luck with your new home.', time: '2024-01-05 16:00' },
        ]
      },
    ];
    setInquiries(data);
    setSelectedInquiry(data[0]);
    setLoading(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedInquiry) return;

    const updatedInquiries = inquiries.map(inq => {
      if (inq.id === selectedInquiry.id) {
        return {
          ...inq,
          messages: [
            ...inq.messages,
            { id: Date.now(), from: 'user', text: newMessage, time: new Date().toLocaleString() }
          ],
          lastMessage: newMessage,
          updatedAt: new Date().toISOString()
        };
      }
      return inq;
    });

    setInquiries(updatedInquiries);
    setSelectedInquiry(updatedInquiries.find(i => i.id === selectedInquiry.id));
    setNewMessage('');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      closed: 'bg-gray-100 text-gray-600'
    };
    return styles[status] || styles.pending;
  };

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);

  return (
    <>
      <SEO title="My Inquiries - HomeScape" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">{inquiries.length} conversations</p>
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-96 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 border-b border-gray-50 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredInquiries.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`w-full p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-colors ${
                      selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={inquiry.agent.image}
                          alt={inquiry.agent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {inquiry.agent.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{inquiry.agent.name}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(inquiry.updatedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{inquiry.property.title}</p>
                        <p className="text-sm text-gray-500 truncate">{inquiry.lastMessage}</p>
                      </div>
                      {inquiry.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {inquiry.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedInquiry ? (
            <div className="hidden md:flex flex-1 flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedInquiry.agent.image}
                    alt={selectedInquiry.agent.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedInquiry.agent.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedInquiry.agent.online ? (
                        <span className="text-green-600">● Online</span>
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/properties/${selectedInquiry.property.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                  >
                    <img
                      src={selectedInquiry.property.image}
                      alt=""
                      className="w-6 h-6 rounded object-cover"
                    />
                    <span className="text-gray-700">View Property</span>
                  </Link>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusBadge(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedInquiry.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.from === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.from === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {selectedInquiry.status !== 'closed' && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
              <div className="text-center">
                <span className="text-6xl mb-4 block">💬</span>
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Inquiries;
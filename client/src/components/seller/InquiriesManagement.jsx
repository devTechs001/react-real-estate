// client/src/pages/seller/SellerInquiries.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const SellerInquiries = () => {
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
        buyer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          verified: true
        },
        status: 'new',
        priority: 'high',
        lastMessage: "Hi, I'm very interested in this property. Is it still available?",
        createdAt: '2024-01-15T10:30:00',
        messages: [
          { id: 1, from: 'buyer', text: "Hi, I'm very interested in this property. Is it still available?", time: '2024-01-15 10:30' },
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
        buyer: {
          name: 'Sarah Smith',
          email: 'sarah@example.com',
          phone: '+1 (555) 234-5678',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          verified: true
        },
        status: 'replied',
        priority: 'medium',
        lastMessage: 'Thank you for your interest! Yes, the property is available for viewing.',
        createdAt: '2024-01-14T14:00:00',
        messages: [
          { id: 1, from: 'buyer', text: 'What are the HOA fees for this property?', time: '2024-01-14 14:00' },
          { id: 2, from: 'seller', text: 'The HOA fees are $500/month and include amenities access.', time: '2024-01-14 15:30' },
          { id: 3, from: 'buyer', text: 'That sounds reasonable. Can I schedule a viewing?', time: '2024-01-14 16:00' },
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
        buyer: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1 (555) 345-6789',
          image: 'https://randomuser.me/api/portraits/men/52.jpg',
          verified: false
        },
        status: 'archived',
        priority: 'low',
        lastMessage: 'Thank you for your time.',
        createdAt: '2024-01-10T09:00:00',
        messages: [
          { id: 1, from: 'buyer', text: 'Is the property pet-friendly?', time: '2024-01-10 09:00' },
          { id: 2, from: 'seller', text: 'Yes, pets are allowed.', time: '2024-01-10 10:00' },
          { id: 3, from: 'buyer', text: "Thank you for your time. I've found another property.", time: '2024-01-10 11:00' },
        ]
      },
    ];
    setInquiries(data);
    setSelectedInquiry(data[0]);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-600'
    };
    return styles[status] || styles.new;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-600'
    };
    return styles[priority] || styles.low;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedInquiry) return;

    const updatedInquiries = inquiries.map(inq => {
      if (inq.id === selectedInquiry.id) {
        return {
          ...inq,
          status: 'replied',
          messages: [
            ...inq.messages,
            { id: Date.now(), from: 'seller', text: newMessage, time: new Date().toLocaleString() }
          ],
          lastMessage: newMessage
        };
      }
      return inq;
    });

    setInquiries(updatedInquiries);
    setSelectedInquiry(updatedInquiries.find(i => i.id === selectedInquiry.id));
    setNewMessage('');
  };

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);
  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <>
      <SEO title="Inquiries - HomeScape Seller" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600">{inquiries.length} total • {newCount} new</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'replied', 'archived'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm capitalize ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
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
          {/* Inquiries List */}
          <div className="w-full md:w-96 border-r border-gray-100 flex flex-col">
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
                  No inquiries found
                </div>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`w-full p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-colors ${
                      selectedInquiry?.id === inquiry.id ? 'bg-purple-50' : ''
                    } ${inquiry.status === 'new' ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={inquiry.buyer.image}
                          alt={inquiry.buyer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {inquiry.buyer.verified && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{inquiry.buyer.name}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(inquiry.priority)}`}>
                            {inquiry.priority}
                          </span>
                        </div>
                        <p className="text-sm text-purple-600 truncate">{inquiry.property.title}</p>
                        <p className="text-sm text-gray-500 truncate">{inquiry.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Conversation View */}
          {selectedInquiry ? (
            <div className="hidden md:flex flex-1 flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedInquiry.buyer.image}
                      alt={selectedInquiry.buyer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{selectedInquiry.buyer.name}</h3>
                        {selectedInquiry.buyer.verified && (
                          <span className="text-green-600 text-xs">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{selectedInquiry.buyer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedInquiry.buyer.phone}`}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      title="Call"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>
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
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedInquiry.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.from === 'seller' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.from === 'seller'
                          ? 'bg-purple-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.from === 'seller' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
                {[
                  'Yes, the property is available!',
                  'Would you like to schedule a viewing?',
                  'I can provide more details.',
                ].map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(reply)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full whitespace-nowrap hover:bg-gray-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
              <div className="text-center">
                <span className="text-6xl mb-4 block">💬</span>
                <p>Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerInquiries;
// client/src/pages/seller/Leads.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLeads([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        status: 'hot',
        interestedIn: ['Luxury Waterfront Villa', 'Modern Downtown Penthouse'],
        source: 'Direct Search',
        lastActivity: '2024-01-15T10:30:00',
        notes: 'Pre-approved for $3M mortgage',
        score: 95
      },
      {
        id: 2,
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '+1 (555) 234-5678',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        status: 'warm',
        interestedIn: ['Modern Downtown Penthouse'],
        source: 'Google',
        lastActivity: '2024-01-14T14:00:00',
        notes: 'Looking for investment property',
        score: 75
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 345-6789',
        image: 'https://randomuser.me/api/portraits/men/52.jpg',
        status: 'cold',
        interestedIn: ['Cozy Mountain Cabin'],
        source: 'Social Media',
        lastActivity: '2024-01-10T09:00:00',
        notes: '',
        score: 40
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 456-7890',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        status: 'hot',
        interestedIn: ['Beach House Paradise'],
        source: 'Referral',
        lastActivity: '2024-01-15T08:00:00',
        notes: 'First-time buyer, very motivated',
        score: 88
      },
    ]);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      hot: { bg: 'bg-red-100', text: 'text-red-700', label: '🔥 Hot' },
      warm: { bg: 'bg-orange-100', text: 'text-orange-700', label: '⚡ Warm' },
      cold: { bg: 'bg-blue-100', text: 'text-blue-700', label: '❄️ Cold' }
    };
    return styles[status] || styles.cold;
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
    toast.success('Lead status updated');
  };

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.status === filter);
  const hotLeadsCount = leads.filter(l => l.status === 'hot').length;

  return (
    <>
      <SEO title="Leads - HomeScape Seller" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">{leads.length} total leads • {hotLeadsCount} hot</p>
        </div>
        <div className="flex gap-2">
          {['all', 'hot', 'warm', 'cold'].map((f) => (
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

      {/* Lead Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Hot Leads', value: leads.filter(l => l.status === 'hot').length, icon: '🔥', color: 'red' },
          { label: 'Warm Leads', value: leads.filter(l => l.status === 'warm').length, icon: '⚡', color: 'orange' },
          { label: 'Cold Leads', value: leads.filter(l => l.status === 'cold').length, icon: '❄️', color: 'blue' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead, index) => {
            const statusInfo = getStatusBadge(lead.status);

            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={lead.image}
                      alt={lead.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                      <p className="text-sm text-gray-500">{lead.source}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Score */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Lead Score</span>
                    <span className="font-medium">{lead.score}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lead.score >= 80 ? 'bg-green-500' : lead.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>

                {/* Interested Properties */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Interested in:</p>
                  <div className="flex flex-wrap gap-1">
                    {lead.interestedIn.map((property, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                        {property}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {lead.notes && (
                  <p className="text-sm text-gray-600 mb-4 italic">"{lead.notes}"</p>
                )}

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <span>📧</span> {lead.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <span>📱</span> {lead.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex-1 py-2 text-center bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                  >
                    Email
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex-1 py-2 text-center border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
                  >
                    Call
                  </a>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="px-2 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="hot">🔥 Hot</option>
                    <option value="warm">⚡ Warm</option>
                    <option value="cold">❄️ Cold</option>
                  </select>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Leads;
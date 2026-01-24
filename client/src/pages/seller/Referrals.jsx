import { useState, useEffect } from 'react';
import { FaLink, FaCopy, FaTrash, FaChartLine } from 'react-icons/fa';
import { referralService } from '../../services/referralService';
import Loader from '../../components/common/Loader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const ReferralManagement = () => {
  const [referrals, setReferrals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [referralsData, analyticsData] = await Promise.all([
        referralService.getMyReferrals(),
        referralService.getReferralAnalytics(),
      ]);
      setReferrals(referralsData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (code) => {
    const shareUrl = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this referral link?')) return;

    try {
      await referralService.deleteReferral(id);
      setReferrals(referrals.filter((r) => r._id !== id));
      toast.success('Referral deleted');
    } catch (error) {
      toast.error('Failed to delete referral');
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await referralService.updateReferral(id, { isActive: !isActive });
      setReferrals(
        referrals.map((r) => (r._id === id ? { ...r, isActive: !isActive } : r))
      );
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Total Links</div>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalReferrals}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Total Clicks</div>
            <div className="text-3xl font-bold text-primary-600">{analytics.totalClicks}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Conversions</div>
            <div className="text-3xl font-bold text-green-600">{analytics.totalConversions}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm mb-2">Conversion Rate</div>
            <div className="text-3xl font-bold text-orange-600">{analytics.conversionRate}</div>
          </div>
        </div>
      )}

      {/* Referrals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FaLink /> Your Referral Links
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr key={referral._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Badge>{referral.referrerType}</Badge>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">
                    {referral.uniqueCode}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <FaChartLine className="text-primary-600" />
                      <span className="font-semibold">{referral.clicks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(referral._id, referral.isActive)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        referral.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {referral.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2 flex">
                    <button
                      onClick={() => handleCopyLink(referral.uniqueCode)}
                      className="text-primary-600 hover:text-primary-700"
                      title="Copy link"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => handleDelete(referral._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {referrals.length === 0 && (
          <div className="text-center py-12">
            <FaLink className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No referral links yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Create shareable links from your property listings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralManagement;

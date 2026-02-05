import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLink, FaHome, FaUser, FaArrowRight } from 'react-icons/fa';
import { referralService } from '@/services/referralService';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import '../styles/InviteLink.css';

const InviteLink = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referral, setReferral] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    processReferralLink();
  }, [code]);

  const processReferralLink = async () => {
    try {
      setLoading(true);
      const data = await referralService.getReferralByCode(code);
      setReferral(data);

      // Redirect based on referral type
      if (data.type === 'property') {
        toast.success(`Viewing property from ${data.seller?.name || 'Agent'}`);
        setTimeout(() => {
          navigate(`/properties/${data.property._id}`);
        }, 1500);
      } else if (data.type === 'seller') {
        toast.success(`Viewing profile of ${data.seller?.name || 'Agent'}`);
        setTimeout(() => {
          navigate(`/seller/${data.seller._id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired link');
      toast.error(err.response?.data?.message || 'Link expired or invalid');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader fullScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <FaLink className="text-6xl text-gray-300 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/properties')} fullWidth>
              Browse Properties
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              fullWidth
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 animate-bounce">
          {referral?.type === 'property' ? (
            <FaHome className="text-6xl text-primary-600 mx-auto" />
          ) : (
            <FaUser className="text-6xl text-primary-600 mx-auto" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {referral?.type === 'property'
            ? 'Viewing Property Listing'
            : 'Viewing Agent Profile'}
        </h1>
        <p className="text-gray-600 mb-6">
          Redirecting you to{' '}
          <strong>{referral?.seller?.name || referral?.property?.title}</strong>
        </p>
        <div className="flex items-center justify-center gap-2 text-primary-600 font-semibold">
          <span>Redirecting</span>
          <FaArrowRight className="animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default InviteLink;

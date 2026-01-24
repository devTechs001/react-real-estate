import { useState } from 'react';
import { FaLink, FaCopy, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaTimes } from 'react-icons/fa';
import { referralService } from '../../services/referralService';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, propertyId, propertyTitle }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const data = await referralService.createPropertyLink(propertyId);
      setShareUrl(data.shareUrl);
      toast.success('Shareable link generated!');
    } catch (error) {
      toast.error('Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=Check out this property: ${propertyTitle}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      action: () => {
        window.open(
          `https://wa.me/?text=Check out this property: ${propertyTitle} ${shareUrl}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: <FaEnvelope />,
      action: () => {
        window.location.href = `mailto:?subject=Check out this property&body=${encodeURIComponent(
          `I found this great property for you:\n\n${propertyTitle}\n\n${shareUrl}`
        )}`;
      },
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Property">
      <div className="space-y-6">
        {!shareUrl ? (
          <div className="text-center py-8">
            <FaLink className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">
              Generate a shareable link to send this property to others
            </p>
            <Button onClick={handleGenerateLink} loading={loading} fullWidth>
              Generate Shareable Link
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="input flex-1"
                />
                <button
                  onClick={handleCopyLink}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FaCopy /> Copy
                </button>
              </div>
            </div>

            {/* Social Share Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Share on Social Media
              </label>
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Anyone who clicks this link will see your property
                listing and your contact information. You can track engagement in your
                dashboard.
              </p>
            </div>

            {/* Generate New Link */}
            <button
              onClick={() => {
                setShareUrl('');
                handleGenerateLink();
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium w-full py-2"
            >
              Generate New Link
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;

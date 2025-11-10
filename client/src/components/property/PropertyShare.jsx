import { useState } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaEnvelope,
  FaLink,
  FaShare 
} from 'react-icons/fa';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const PropertyShare = ({ property }) => {
  const [isOpen, setIsOpen] = useState(false);

  const propertyUrl = `${window.location.origin}/properties/${property._id}`;
  const shareText = `Check out this property: ${property.title}`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(propertyUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(propertyUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + propertyUrl)}`,
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(propertyUrl)}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(propertyUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary flex items-center gap-2"
      >
        <FaShare />
        Share
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Share Property"
        size="sm"
      >
        <div className="space-y-4">
          {/* Share Buttons */}
          <div className="grid grid-cols-5 gap-3">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleShare(link.url)}
                className={`${link.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center gap-1`}
                title={link.name}
              >
                <link.icon size={20} />
                <span className="text-xs">{link.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={propertyUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="btn btn-primary flex items-center gap-2"
              >
                <FaLink />
                Copy
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PropertyShare;
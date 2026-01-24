import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCalendar,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { propertyService } from '../services/PropertyService';
import { favoriteService } from '../services/favoriteService';
import PropertyImageGallery from '../components/property/PropertyImageGallery';
import PropertyMap from '../components/property/PropertyMap';
import PropertyReviews from '../components/property/PropertyReviews';
import PropertyStats from '../components/property/PropertyStats';
import SimilarProperties from '../components/property/SimilarProperties';
import PropertyShare from '../components/property/PropertyShare';
import InquiryForm from '../components/forms/InquiryForm';
import AppointmentForm from '../components/forms/AppointmentForm';
import Loader from '../components/common/Loader';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SEO from '../components/common/SEO';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);

  useEffect(() => {
    fetchProperty();
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getProperty(id);
      setProperty(data);
    } catch (error) {
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const data = await favoriteService.checkFavorite(id);
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error('Failed to check favorite status');
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(id);
        toast.success('Removed from favorites');
      } else {
        await favoriteService.addFavorite(id);
        toast.success('Added to favorites');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleInquirySubmit = async (inquiryData) => {
    try {
      await propertyService.sendInquiry(inquiryData);
      toast.success('Inquiry sent successfully!');
      setInquiryModal(false);
    } catch (error) {
      toast.error('Failed to send inquiry');
    }
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      await propertyService.requestAppointment(appointmentData);
      toast.success('Appointment request sent!');
      setAppointmentModal(false);
    } catch (error) {
      toast.error('Failed to request appointment');
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!property) return null;

  const features = [
    { icon: FaBed, label: 'Bedrooms', value: property.bedrooms },
    { icon: FaBath, label: 'Bathrooms', value: property.bathrooms },
    { icon: FaRulerCombined, label: 'Area', value: `${property.area} sqft` },
    { icon: FaCalendar, label: 'Year Built', value: property.yearBuilt },
  ];

  return (
    <>
      <SEO
        title={property.title}
        description={property.description}
        image={property.images[0]}
        type="article"
      />

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <PropertyImageGallery images={property.images} title={property.title} />

            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="btn btn-secondary"
                  >
                    {isFavorited ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                  <PropertyShare property={property} />
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                  {property.listingType === 'rent' && (
                    <span className="text-lg text-gray-600">/month</span>
                  )}
                </div>
                <Badge variant="primary" size="lg">
                  For {property.listingType}
                </Badge>
                <Badge variant="success" size="lg">
                  {property.propertyType}
                </Badge>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <feature.icon className="text-3xl text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{feature.value}</p>
                  <p className="text-sm text-gray-600">{feature.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <PropertyMap
              latitude={property.latitude || 40.7128}
              longitude={property.longitude || -74.006}
              address={`${property.address}, ${property.city}, ${property.state}`}
            />

            {/* Reviews */}
            <PropertyReviews propertyId={property._id} />

            {/* Similar Properties */}
            <SimilarProperties
              propertyId={property._id}
              propertyType={property.propertyType}
              city={property.city}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Contact Agent</h3>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <img
                  src={property.owner?.avatar || '/default-avatar.png'}
                  alt={property.owner?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-semibold">{property.owner?.name}</p>
                  <p className="text-sm text-gray-600">{property.owner?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setInquiryModal(true)}
                  fullWidth
                >
                  <FaEnvelope className="mr-2" />
                  Send Message
                </Button>

                <Button
                  onClick={() => setAppointmentModal(true)}
                  variant="secondary"
                  fullWidth
                >
                  <FaCalendar className="mr-2" />
                  Schedule Viewing
                </Button>

                {property.owner?.phone && (
                  <Button
                    as="a"
                    href={`tel:${property.owner.phone}`}
                    variant="outline"
                    fullWidth
                  >
                    <FaPhone className="mr-2" />
                    Call Now
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <PropertyStats property={property} />
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Modal
        isOpen={inquiryModal}
        onClose={() => setInquiryModal(false)}
        title="Send Inquiry"
        size="md"
      >
        <InquiryForm
          property={property}
          onSubmit={handleInquirySubmit}
          onCancel={() => setInquiryModal(false)}
        />
      </Modal>

      {/* Appointment Modal */}
      <Modal
        isOpen={appointmentModal}
        onClose={() => setAppointmentModal(false)}
        title="Schedule Appointment"
        size="md"
      >
        <AppointmentForm
          property={property}
          onSubmit={handleAppointmentSubmit}
          onCancel={() => setAppointmentModal(false)}
        />
      </Modal>
    </>
  );
};

export default PropertyDetail;
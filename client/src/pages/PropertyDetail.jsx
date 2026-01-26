// client/src/pages/PropertyDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Mock property data
  const mockProperty = {
    id: 1,
    title: 'Luxury Waterfront Villa with Stunning Ocean Views',
    description: `This stunning waterfront villa offers the ultimate in luxury living. Featuring breathtaking ocean views from every room, this architectural masterpiece combines modern design with timeless elegance.

    The open-concept main floor seamlessly blends indoor and outdoor living, with floor-to-ceiling windows that flood the space with natural light. The gourmet kitchen features top-of-the-line appliances, custom cabinetry, and a large center island perfect for entertaining.

    The master suite occupies the entire top floor, offering panoramic views, a spa-like bathroom, and a private balcony. Additional bedrooms each have their own en-suite bathrooms and walk-in closets.

    Outside, you'll find a heated infinity pool, outdoor kitchen, and direct beach access. The property also includes a 3-car garage, smart home technology, and 24/7 security.`,
    price: 2500000,
    listingType: 'sale',
    location: {
      address: '123 Ocean Drive',
      city: 'Miami Beach',
      state: 'FL',
      zip: '33139',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    lotSize: 0.5,
    yearBuilt: 2020,
    propertyType: 'Villa',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
    ],
    features: ['Ocean View', 'Infinity Pool', 'Smart Home', 'Wine Cellar', 'Home Theater', 'Gym'],
    amenities: ['Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Fireplace', 'Security System', 'Garage', 'EV Charging'],
    agent: {
      name: 'Sarah Mitchell',
      phone: '+1 (555) 123-4567',
      email: 'sarah@homescape.com',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.9,
      reviewCount: 127,
      propertiesSold: 245
    },
    rating: 4.9,
    reviewCount: 45,
    views: 1234,
    createdAt: '2024-01-15',
    featured: true
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setProperty(mockProperty);
    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
              <div className="h-80 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Link to="/properties" className="text-blue-600 hover:underline">
            Browse all properties →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${property.title} - HomeScape`} description={property.description.substring(0, 160)} />

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Image Gallery */}
        <section className="relative">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-4 gap-2 h-[500px] rounded-2xl overflow-hidden">
              {/* Main Image */}
              <div 
                className="col-span-2 row-span-2 relative cursor-pointer group"
                onClick={() => setShowGallery(true)}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>

              {/* Thumbnails */}
              {property.images.slice(1, 5).map((image, index) => (
                <div 
                  key={index}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => setShowGallery(true)}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        +{property.images.length - 5} Photos
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gallery Button */}
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-8 right-8 px-4 py-2 bg-white rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View All Photos
            </button>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {property.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                      {property.propertyType}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      📍 {property.location.address}, {property.location.city}, {property.location.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      {property.rating} ({property.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                    {property.listingType === 'rent' && (
                      <span className="text-gray-500 text-xl">/month</span>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-2xl mb-1">🛏️</div>
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-2xl mb-1">🚿</div>
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-2xl mb-1">📐</div>
                    <div className="text-2xl font-bold text-gray-900">{property.area.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Sq Ft</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-2xl mb-1">📅</div>
                    <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                    <div className="text-sm text-gray-500">Year Built</div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                  <div className="text-gray-600 whitespace-pre-line">{property.description}</div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Highlights</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-blue-600">✓</span>
                        <span className="text-gray-700 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="h-80 bg-gray-200 rounded-xl overflow-hidden">
                    <iframe
                      title="Property Location"
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.8548686813847!2d${property.location.coordinates.lng}!3d${property.location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ1JzQyLjEiTiA4MMKwMTEnMzAuNSJX!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Contact */}
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      isFavorite 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 flex items-center justify-center gap-2 hover:border-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>

                {/* Agent Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={property.agent.image}
                      alt={property.agent.name}
                      className="w-16 h-16 rounded-full border-2 border-white shadow"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.agent.name}</h3>
                      <p className="text-sm text-gray-500">Property Agent</p>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-medium">{property.agent.rating}</span>
                        <span className="text-gray-400">({property.agent.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      📞 Call Agent
                    </a>
                    <button
                      onClick={() => setShowInquiryForm(true)}
                      className="w-full py-3 border border-blue-600 text-blue-600 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                    >
                      ✉️ Send Message
                    </button>
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                      📅 Schedule Tour
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    {property.views.toLocaleString()} people viewed this property
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Modal */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black flex items-center justify-center"
              onClick={() => setShowGallery(false)}
            >
              <button
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
                onClick={() => setShowGallery(false)}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
                }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <img
                src={property.images[activeImage]}
                alt={`${property.title} ${activeImage + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) => (prev + 1) % property.images.length);
                }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeImage ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inquiry Modal */}
        <AnimatePresence>
          {showInquiryForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowInquiryForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 resize-none"
                    defaultValue={`I'm interested in ${property.title}`}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
};

export default PropertyDetails;
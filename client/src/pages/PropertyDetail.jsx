// client/src/pages/PropertyDetails.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeart,
  FaShare,
  FaPrint,
  FaDownload,
  FaExpand,
  FaCompress,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaCar,
  FaRuler,
  FaCalendar,
  FaEye,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaVideo,
  FaCube,
  FaCamera,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaClock,
  FaUser,
  FaUsers,
  FaCalculator,
  FaMapMarked,
  FaWalking,
  FaGraduationCap,
  FaShieldAlt,
  FaMoneyBillWave,
  FaHome,
  FaFire,
  FaSnowflake,
  FaBolt,
  FaWater,
  FaWifi,
  FaTv,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaTree,
  FaElevator,
  FaComments,
  FaThumbsUp,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaFilePdf,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/PropertyDetail.css';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [copied, setCopied] = useState(false);
  const galleryRef = useRef(null);

  // Mortgage calculator state
  const [mortgage, setMortgage] = useState({
    downPayment: 20,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 1.2,
    insurance: 0.5,
    hoa: 0
  });

  // Mock property data with extensive details
  const mockProperty = {
    id: 1,
    title: 'Luxury Waterfront Villa with Stunning Ocean Views',
    description: `This stunning waterfront villa offers the ultimate in luxury living. Featuring breathtaking ocean views from every room, this architectural masterpiece combines modern design with timeless elegance.

The open-concept main floor seamlessly blends indoor and outdoor living, with floor-to-ceiling windows that flood the space with natural light. The gourmet kitchen features top-of-the-line appliances, custom cabinetry, and a large center island perfect for entertaining.

The master suite occupies the entire top floor, offering panoramic views, a spa-like bathroom, and a private balcony. Additional bedrooms each have their own en-suite bathrooms and walk-in closets.

Outside, you'll find a heated infinity pool, outdoor kitchen, and direct beach access. The property also includes a 3-car garage, smart home technology, and 24/7 security.`,
    price: 2500000,
    pricePerSqft: 556,
    listingType: 'sale',
    status: 'active',
    location: {
      address: '123 Ocean Drive',
      city: 'Miami Beach',
      state: 'FL',
      zip: '33139',
      neighborhood: 'South Beach',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    bedrooms: 5,
    bathrooms: 4,
    halfBathrooms: 1,
    area: 4500,
    lotSize: 0.5,
    yearBuilt: 2020,
    propertyType: 'Villa',
    parking: 3,
    stories: 3,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
      'https://images.unsplash.com/photo-1600573472591-62f331f62c0f?w=1200'
    ],
    videoTour: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    virtualTour: 'https://my.matterport.com/show/?m=example',
    floorPlan: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800',
    features: [
      'Ocean View',
      'Infinity Pool',
      'Smart Home',
      'Wine Cellar',
      'Home Theater',
      'Gym',
      'Gourmet Kitchen',
      'Master Suite',
      'Walk-in Closets',
      'Spa Bathroom',
      'Private Beach Access',
      'Outdoor Kitchen'
    ],
    amenities: [
      'Air Conditioning',
      'Heating',
      'Washer/Dryer',
      'Dishwasher',
      'Fireplace',
      'Security System',
      'Garage',
      'EV Charging',
      'High-Speed Internet',
      'Cable TV',
      'Intercom',
      'Sprinkler System'
    ],
    appliances: ['Refrigerator', 'Stove', 'Oven', 'Microwave', 'Dishwasher', 'Washer', 'Dryer'],
    heating: 'Central',
    cooling: 'Central A/C',
    utilities: {
      electric: 250,
      gas: 80,
      water: 60,
      internet: 100,
      cable: 150
    },
    hoa: {
      fee: 500,
      frequency: 'monthly',
      amenities: ['Pool', 'Gym', 'Security', 'Landscaping']
    },
    tax: {
      annual: 24000,
      assessed: 2400000
    },
    schools: [
      { name: 'Miami Beach Elementary', distance: 0.5, rating: 9, type: 'Elementary' },
      { name: 'Nautilus Middle School', distance: 1.2, rating: 8, type: 'Middle' },
      { name: 'Miami Beach High School', distance: 1.8, rating: 7, type: 'High' }
    ],
    walkScore: 92,
    transitScore: 88,
    bikeScore: 85,
    crimeRating: 'Low',
    agent: {
      id: 1,
      name: 'Sarah Mitchell',
      phone: '+1 (555) 123-4567',
      email: 'sarah@homescape.com',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 4.9,
      reviewCount: 127,
      propertiesSold: 245,
      yearsExperience: 12,
      bio: 'Luxury real estate specialist with over 12 years of experience in waterfront properties. Dedicated to helping clients find their dream homes.',
      languages: ['English', 'Spanish', 'French'],
      responseTime: '< 1 hour',
      specialties: ['Waterfront', 'Luxury Homes', 'Investment Properties']
    },
    priceHistory: [
      { date: '2024-01-15', price: 2500000, event: 'Listed' },
      { date: '2023-12-01', price: 2600000, event: 'Price Change' },
      { date: '2023-10-15', price: 2700000, event: 'Listed' }
    ],
    openHouses: [
      { date: '2024-02-10', startTime: '10:00 AM', endTime: '2:00 PM' },
      { date: '2024-02-11', startTime: '1:00 PM', endTime: '4:00 PM' }
    ],
    rating: 4.9,
    reviewCount: 45,
    views: 1234,
    favorites: 89,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    featured: true,
    verified: true,
    daysOnMarket: 12,
    similarProperties: [2, 3, 4],
    nearbyPlaces: {
      restaurants: 45,
      shopping: 23,
      parks: 8,
      hospitals: 3,
      schools: 12
    },
    reviews: [
      {
        id: 1,
        user: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=10',
        rating: 5,
        date: '2024-01-10',
        comment: 'Absolutely stunning property! The ocean views are breathtaking. Highly recommend scheduling a tour.',
        helpful: 12
      },
      {
        id: 2,
        user: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=20',
        rating: 5,
        date: '2024-01-08',
        comment: 'The virtual tour was amazing. Can\'t wait to see it in person. Sarah was very helpful!',
        helpful: 8
      },
      {
        id: 3,
        user: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=30',
        rating: 4,
        date: '2024-01-05',
        comment: 'Beautiful home with great amenities. The neighborhood is perfect for families.',
        helpful: 5
      }
    ]
  };

  useEffect(() => {
    fetchProperty();
    // Track view
    trackPropertyView();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProperty(mockProperty);
    setLoading(false);
  };

  const trackPropertyView = () => {
    // Track property view analytics
    console.log('Property viewed:', id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateMortgage = () => {
    const principal = property.price * (1 - mortgage.downPayment / 100);
    const monthlyRate = mortgage.interestRate / 100 / 12;
    const numberOfPayments = mortgage.loanTerm * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const monthlyTax = (property.tax.annual / 12);
    const monthlyInsurance = (property.price * (mortgage.insurance / 100)) / 12;
    const monthlyHOA = mortgage.hoa;
    
    const totalMonthly = monthlyPayment + monthlyTax + monthlyInsurance + monthlyHOA;
    
    return {
      monthlyPayment,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthly,
      downPaymentAmount: property.price * (mortgage.downPayment / 100)
    };
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites', {
      icon: isFavorite ? '💔' : '❤️'
    });
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Check out this property: ${property.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'native':
        if (navigator.share) {
          await navigator.share({ title: property.title, url });
        }
        break;
      default:
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.success('Downloading property brochure...', { icon: '📄' });
    // Implement PDF generation
  };

  const handleScheduleTour = (e) => {
    e.preventDefault();
    toast.success('Tour scheduled successfully!', { icon: '📅' });
    setShowScheduleForm(false);
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    toast.success('Message sent to agent!', { icon: '✉️' });
    setShowInquiryForm(false);
  };

  const handleMakeOffer = (e) => {
    e.preventDefault();
    toast.success('Offer submitted!', { icon: '💰' });
    setShowOfferForm(false);
  };

  // Price history chart data
  const priceHistoryData = {
    labels: property?.priceHistory?.map(h => new Date(h.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Price',
        data: property?.priceHistory?.map(h => h.price) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => formatPrice(context.parsed.y)
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => '$' + (value / 1000000).toFixed(1) + 'M'
        }
      }
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
          <div className="text-6xl mb-6">🏠</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
            Browse All Properties →
          </Link>
        </div>
      </div>
    );
  }

  const mortgageCalc = calculateMortgage();

  return (
    <>
      <SEO 
        title={`${property.title} - HomeScape`} 
        description={property.description.substring(0, 160)}
        image={property.images[0]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />

        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <FaChevronRight className="text-xs" />
              <Link to="/properties" className="hover:text-blue-600">Properties</Link>
              <FaChevronRight className="text-xs" />
              <Link to={`/properties?city=${property.location.city}`} className="hover:text-blue-600">
                {property.location.city}
              </Link>
              <FaChevronRight className="text-xs" />
              <span className="text-gray-900 font-medium truncate">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <FaArrowLeft />
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavorite}
                  className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    isFavorite
                      ? 'bg-red-50 border-red-500 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <FaHeart className={isFavorite ? 'fill-current' : ''} />
                  Save
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 flex items-center gap-2"
                >
                  <FaShare />
                  Share
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 flex items-center gap-2"
                >
                  <FaPrint />
                  Print
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaDownload />
                  Brochure
                </motion.button>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden" style={{ height: '600px' }}>
              {/* Main Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-2 row-span-2 relative cursor-pointer group"
                onClick={() => setShowGallery(true)}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <FaExpand className="text-2xl text-gray-900" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Grid Images */}
              {property.images.slice(1, 7).map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setActiveImage(index + 1);
                    setShowGallery(true);
                  }}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 5 && property.images.length > 7 && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                      <FaCamera className="text-4xl mb-2" />
                      <span className="text-2xl font-bold">+{property.images.length - 7}</span>
                      <span className="text-sm">More Photos</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              ))}
            </div>

            {/* Media Controls */}
            <div className="flex items-center gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGallery(true)}
                className="flex-1 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 font-medium"
              >
                <FaCamera />
                View All {property.images.length} Photos
              </motion.button>

              {property.videoTour && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlayingVideo(true)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
                >
                  <FaVideo />
                  Video Tour
                </motion.button>
              )}

              {property.virtualTour && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVirtualTour(true)}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2 font-medium"
                >
                  <FaCube />
                  3D Virtual Tour
                </motion.button>
              )}

              {property.floorPlan && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFloorPlan(true)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                >
                  <FaHome />
                  Floor Plan
                </motion.button>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Property Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {property.featured && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <FaStar /> Featured
                      </span>
                    )}
                    {property.verified && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                    <span className={`px-4 py-1.5 text-white text-sm font-bold rounded-full ${
                      property.listingType === 'rent' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}>
                      {property.listingType === 'rent' ? '🏠 For Rent' : '💰 For Sale'}
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-800 text-sm font-bold rounded-full">
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{property.title}</h1>

                  {/* Location & Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span className="font-medium">
                        {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="font-semibold">{property.rating}</span>
                      <span>({property.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="text-gray-400" />
                      <span>{property.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaHeart className="text-gray-400" />
                      <span>{property.favorites} saves</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(property.price)}
                    </span>
                    {property.listingType === 'rent' && (
                      <span className="text-2xl text-gray-500">/month</span>
                    )}
                    <span className="text-gray-500">
                      ${property.pricePerSqft}/sqft
                    </span>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border-2 border-blue-200">
                      <FaBed className="text-3xl text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border-2 border-purple-200">
                      <FaBath className="text-3xl text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.bathrooms}.{property.halfBathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border-2 border-green-200">
                      <FaRuler className="text-3xl text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.area.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border-2 border-orange-200">
                      <FaCar className="text-3xl text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.parking}</div>
                      <div className="text-sm text-gray-600">Parking</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border-2 border-red-200">
                      <FaCalendar className="text-3xl text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                      <div className="text-sm text-gray-600">Built</div>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                      {[
                        { id: 'overview', label: 'Overview', icon: FaHome },
                        { id: 'details', label: 'Details', icon: FaCheckCircle },
                        { id: 'features', label: 'Features', icon: FaStar },
                        { id: 'location', label: 'Location', icon: FaMapMarked },
                        { id: 'financials', label: 'Financials', icon: FaMoneyBillWave },
                        { id: 'history', label: 'History', icon: FaChartLine },
                        { id: 'reviews', label: 'Reviews', icon: FaComments }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                              activeTab === tab.id
                                ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <Icon />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                          <div className="prose max-w-none text-gray-700 leading-relaxed">
                            {property.description.split('\n\n').map((para, i) => (
                              <p key={i} className="mb-4">{para}</p>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowScheduleForm(true)}
                            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                          >
                            <FaCalendar />
                            Schedule a Tour
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowMortgageCalc(true)}
                            className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                          >
                            <FaCalculator />
                            Mortgage Calculator
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          {[
                            { label: 'Property Type', value: property.propertyType },
                            { label: 'Lot Size', value: `${property.lotSize} acres` },
                            { label: 'Stories', value: property.stories },
                            { label: 'Heating', value: property.heating },
                            { label: 'Cooling', value: property.cooling },
                            { label: 'Parking Spaces', value: property.parking },
                            { label: 'Year Built', value: property.yearBuilt },
                            { label: 'Days on Market', value: property.daysOnMarket },
                            { label: 'MLS#', value: `MLS${property.id.toString().padStart(8, '0')}` },
                            { label: 'Status', value: property.status.charAt(0).toUpperCase() + property.status.slice(1) }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                              <span className="text-gray-600 font-medium">{item.label}</span>
                              <span className="text-gray-900 font-bold">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interior Features</h2>
                          <div className="grid md:grid-cols-3 gap-4">
                            {property.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <FaCheckCircle className="text-blue-600 text-xl flex-shrink-0" />
                                <span className="text-gray-900 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                          <div className="grid md:grid-cols-4 gap-3">
                            {property.amenities.map((amenity, i) => (
                              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                <FaCheck className="text-green-600" />
                                <span className="text-gray-700 text-sm">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appliances</h2>
                          <div className="grid md:grid-cols-3 gap-3">
                            {property.appliances.map((appliance, i) => (
                              <div key={i} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <FaCheck className="text-purple-600" />
                                <span className="text-gray-700">{appliance}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Location Tab */}
                    {activeTab === 'location' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Scores */}
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-300">
                            <FaWalking className="text-4xl text-green-600 mb-3" />
                            <div className="text-4xl font-bold text-gray-900 mb-1">{property.walkScore}</div>
                            <div className="text-sm text-gray-600 font-medium">Walk Score</div>
                            <div className="text-xs text-gray-500 mt-1">Very Walkable</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-300">
                            <svg className="w-10 h-10 text-blue-600 mb-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <div className="text-4xl font-bold text-gray-900 mb-1">{property.transitScore}</div>
                            <div className="text-sm text-gray-600 font-medium">Transit Score</div>
                            <div className="text-xs text-gray-500 mt-1">Excellent Transit</div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-300">
                            <svg className="w-10 h-10 text-orange-600 mb-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            <div className="text-4xl font-bold text-gray-900 mb-1">{property.bikeScore}</div>
                            <div className="text-sm text-gray-600 font-medium">Bike Score</div>
                            <div className="text-xs text-gray-500 mt-1">Very Bikeable</div>
                          </div>
                        </div>

                        {/* Map */}
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Map & Nearby Places</h2>
                          <div className="h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
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

                        {/* Nearby Places */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">What's Nearby</h3>
                          <div className="grid md:grid-cols-5 gap-4">
                            {[
                              { label: 'Restaurants', count: property.nearbyPlaces.restaurants, icon: '🍽️' },
                              { label: 'Shopping', count: property.nearbyPlaces.shopping, icon: '🛍️' },
                              { label: 'Parks', count: property.nearbyPlaces.parks, icon: '🌳' },
                              { label: 'Hospitals', count: property.nearbyPlaces.hospitals, icon: '🏥' },
                              { label: 'Schools', count: property.nearbyPlaces.schools, icon: '🎓' }
                            ].map((place, i) => (
                              <div key={i} className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                                <div className="text-3xl mb-2">{place.icon}</div>
                                <div className="text-2xl font-bold text-gray-900">{place.count}</div>
                                <div className="text-sm text-gray-600">{place.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Schools */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Nearby Schools</h3>
                          <div className="space-y-3">
                            {property.schools.map((school, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <FaGraduationCap className="text-blue-600" />
                                    <h4 className="font-bold text-gray-900">{school.name}</h4>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>{school.type}</span>
                                    <span>•</span>
                                    <span>{school.distance} miles away</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{school.rating}</div>
                                    <div className="text-xs text-gray-500">Rating</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Safety */}
                        <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                          <div className="flex items-center gap-3 mb-3">
                            <FaShieldAlt className="text-3xl text-green-600" />
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Neighborhood Safety</h3>
                              <p className="text-green-700 font-medium">Low Crime Area</p>
                            </div>
                          </div>
                          <p className="text-gray-700">
                            This neighborhood has a {property.crimeRating.toLowerCase()} crime rating, making it a safe and family-friendly area.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Financials Tab */}
                    {activeTab === 'financials' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Monthly Costs */}
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Costs Estimate</h2>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-300">
                            <div className="text-center mb-6">
                              <div className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</div>
                              <div className="text-5xl font-bold text-blue-600">
                                {formatPrice(mortgageCalc.totalMonthly)}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                with {mortgage.downPayment}% down • {mortgage.interestRate}% APR
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">Principal & Interest</div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatPrice(mortgageCalc.monthlyPayment)}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">Property Tax</div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatPrice(mortgageCalc.monthlyTax)}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">Home Insurance</div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatPrice(mortgageCalc.monthlyInsurance)}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">HOA Fees</div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatPrice(property.hoa.fee)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tax Information */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Property Tax</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Annual Tax</div>
                              <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(property.tax.annual)}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                ({formatPrice(property.tax.annual / 12)}/month)
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Assessed Value</div>
                              <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(property.tax.assessed)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* HOA Information */}
                        {property.hoa && (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">HOA Details</h3>
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">HOA Fee</div>
                                  <div className="text-3xl font-bold text-gray-900">
                                    {formatPrice(property.hoa.fee)}
                                  </div>
                                  <div className="text-sm text-gray-500">{property.hoa.frequency}</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-700 mb-2">Included Amenities:</div>
                                <div className="flex flex-wrap gap-2">
                                  {property.hoa.amenities.map((amenity, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Utilities */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Estimated Utilities</h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                              { label: 'Electric', amount: property.utilities.electric, icon: FaBolt },
                              { label: 'Gas', amount: property.utilities.gas, icon: FaFire },
                              { label: 'Water', amount: property.utilities.water, icon: FaWater },
                              { label: 'Internet', amount: property.utilities.internet, icon: FaWifi },
                              { label: 'Cable TV', amount: property.utilities.cable, icon: FaTv }
                            ].map((utility, i) => {
                              const Icon = utility.icon;
                              return (
                                <div key={i} className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                                  <Icon className="text-2xl text-blue-600 mx-auto mb-2" />
                                  <div className="text-lg font-bold text-gray-900">
                                    ${utility.amount}
                                  </div>
                                  <div className="text-xs text-gray-600">{utility.label}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Calculator Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowMortgageCalc(true)}
                          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                        >
                          <FaCalculator className="text-xl" />
                          Open Detailed Mortgage Calculator
                        </motion.button>
                      </motion.div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Price History Chart */}
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Price History</h2>
                          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                            <div style={{ height: '300px' }}>
                              <Line data={priceHistoryData} options={chartOptions} />
                            </div>
                          </div>
                        </div>

                        {/* Price Changes Timeline */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Timeline</h3>
                          <div className="space-y-4">
                            {property.priceHistory.map((item, i) => (
                              <div key={i} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  {item.event === 'Listed' ? <FaHome className="text-blue-600" /> :
                                   item.event === 'Price Change' ? <FaChartLine className="text-orange-600" /> :
                                   <FaCheckCircle className="text-green-600" />}
                                </div>
                                <div className="flex-1 bg-white p-4 rounded-xl border-2 border-gray-200">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900">{item.event}</h4>
                                    <span className="text-sm text-gray-500">
                                      {new Date(item.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-600">
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Days on Market */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-300">
                          <div className="flex items-center gap-3">
                            <FaClock className="text-3xl text-purple-600" />
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Days on Market</h3>
                              <p className="text-4xl font-bold text-purple-600">{property.daysOnMarket} days</p>
                              <p className="text-gray-600">Listed since {new Date(property.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Rating Summary */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-300 text-center">
                            <FaStar className="text-6xl text-yellow-500 mx-auto mb-4" />
                            <div className="text-6xl font-bold text-gray-900 mb-2">{property.rating}</div>
                            <div className="text-gray-600 font-medium">out of 5.0</div>
                            <div className="text-sm text-gray-500 mt-1">
                              Based on {property.reviewCount} reviews
                            </div>
                          </div>

                          <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((stars) => {
                              const count = stars === 5 ? 35 : stars === 4 ? 8 : stars === 3 ? 2 : 0;
                              const percentage = (count / property.reviewCount) * 100;
                              return (
                                <div key={stars} className="flex items-center gap-3">
                                  <span className="text-sm font-medium w-16">{stars} stars</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div
                                      className="bg-yellow-400 h-3 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600 w-12">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
                          {property.reviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-xl border-2 border-gray-200">
                              <div className="flex items-start gap-4">
                                <img
                                  src={review.avatar}
                                  alt={review.user}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h4 className="font-bold text-gray-900">{review.user}</h4>
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <FaStar
                                            key={i}
                                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 mb-3">{review.comment}</p>
                                  <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                                      <FaThumbsUp />
                                      Helpful ({review.helpful})
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Write Review Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                        >
                          <FaComment />
                          Write a Review
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Open Houses */}
                {property.openHouses && property.openHouses.length > 0 && (
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <FaCalendar className="text-4xl" />
                      <div>
                        <h2 className="text-2xl font-bold">Open Houses</h2>
                        <p className="text-green-100">Schedule your visit</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {property.openHouses.map((oh, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                          <div className="font-bold text-xl mb-2">
                            {new Date(oh.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-green-100">
                            {oh.startTime} - {oh.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Agent & Actions */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3 sticky top-24">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowScheduleForm(true)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                  >
                    <FaCalendar />
                    Schedule a Tour
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEnvelope />
                    Send Message
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOfferForm(true)}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                  >
                    <FaMoneyBillWave />
                    Make an Offer
                  </motion.button>

                  <a
                    href={`tel:${property.agent.phone}`}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPhone />
                    Call Agent
                  </a>
                </div>

                {/* Agent Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Listed By</h3>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={property.agent.image}
                      alt={property.agent.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{property.agent.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">Property Specialist</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(property.agent.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{property.agent.rating}</span>
                        <span className="text-sm text-gray-500">({property.agent.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaTrophy className="text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Properties Sold</div>
                        <div className="font-bold text-gray-900">{property.agent.propertiesSold}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaClock className="text-green-600" />
                      <div>
                        <div className="text-sm text-gray-600">Response Time</div>
                        <div className="font-bold text-gray-900">{property.agent.responseTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaUsers className="text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                        <div className="font-bold text-gray-900">{property.agent.yearsExperience} years</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-700 leading-relaxed">{property.agent.bio}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {property.agent.specialties.map((specialty, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mortgage Calculator Preview */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-4">
                    <FaCalculator className="text-2xl text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Est. Monthly Payment</h3>
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-4">
                    {formatPrice(mortgageCalc.totalMonthly)}
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-medium">{formatPrice(mortgageCalc.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-medium">{formatPrice(mortgageCalc.monthlyTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">{formatPrice(mortgageCalc.monthlyInsurance)}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMortgageCalc(true)}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                  >
                    View Full Calculator
                  </motion.button>
                </div>

                {/* Share */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Share This Property</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { platform: 'whatsapp', icon: FaWhatsapp, color: 'green' },
                      { platform: 'facebook', icon: FaFacebook, color: 'blue' },
                      { platform: 'twitter', icon: FaTwitter, color: 'blue' },
                      { platform: 'copy', icon: copied ? FaCheck : FaCopy, color: 'gray' }
                    ].map(({ platform, icon: Icon, color }) => (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(platform)}
                        className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl hover:bg-${color}-100 transition-colors flex items-center justify-center gap-2`}
                      >
                        <Icon className="text-xl" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Modals */}
      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <FaTimes className="text-2xl text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium z-10">
              {activeImage + 1} / {property.images.length}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length)}
              className="absolute left-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <FaChevronLeft className="text-2xl text-white" />
            </button>

            <button
              onClick={() => setActiveImage((prev) => (prev + 1) % property.images.length)}
              className="absolute right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <FaChevronRight className="text-2xl text-white" />
            </button>

            {/* Main Image */}
            <img
              src={property.images[activeImage]}
              alt={`${property.title} ${activeImage + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-white scale-110' : 'border-white/30 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other modals (Inquiry, Schedule, Mortgage, Offer, Share, etc.) would go here */}
      {/* Due to length constraints, I'll provide the structure */}
      
      {/* Schedule Tour Modal */}
      <AnimatePresence>
        {showScheduleForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowScheduleForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Tour</h3>
              <form onSubmit={handleScheduleTour} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
                <textarea
                  placeholder="Message (Optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar modals for Inquiry, Mortgage Calculator, Make Offer, Share, etc. */}
    </>
  );
};

export default PropertyDetails;
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { propertyService } from '../../services/PropertyService';

const AddProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    status: 'for-sale',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    lotSize: '',
    yearBuilt: '',
    amenities: [],
    features: [],
    images: [],
    videoUrl: '',
    virtualTourUrl: '',
    documents: [],
    agentCommission: '',
    propertyTax: '',
    hoaFees: '',
    utilitiesIncluded: false,
    parkingSpaces: 1,
    heating: '',
    cooling: '',
    flooring: '',
    appliances: [],
    exteriorFeatures: [],
    roofType: '',
    foundationType: '',
    condition: 'excellent',
    petPolicy: 'no-pets',
    smokingAllowed: false,
    accessibilityFeatures: [],
    energyEfficiency: '',
    ecoFeatures: [],
    nearTransportation: false,
    nearShopping: false,
    nearSchools: false,
    nearHospital: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
      case 2: // Property Details
        if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms is required';
        if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms is required';
        if (!formData.area) newErrors.area = 'Area is required';
        break;
      case 3: // Images & Media
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step) && step < 3) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach((image, index) => {
            submitData.append('images', image.file);
          });
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach(value => {
            submitData.append(key, value);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await propertyService.updateProperty(id, submitData);
        toast.success('Property updated successfully');
      } else {
        await propertyService.createProperty(submitData);
        toast.success('Property created successfully');
      }

      navigate('/seller/properties');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update property' : 'Failed to create property');
      console.error('Property submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Property Details' },
    { number: 3, title: 'Images & Media' },
    { number: 4, title: 'Review & Submit' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO title={isEdit ? 'Edit Property' : 'Add Property'} description="Add or edit property details" />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your property listing' : 'List your property for sale or rent'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepInfo, index) => (
              <div key={stepInfo.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepInfo.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepInfo.number}
                </div>
                <span className={`ml-2 hidden md:inline ${
                  step >= stepInfo.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {stepInfo.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepInfo.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.title ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                    placeholder="Enter property title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                    <option value="leased">Leased</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.price ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                    placeholder="Enter price"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                    placeholder="Describe your property..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.bedrooms ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                    min="0"
                  />
                  {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.bathrooms ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                    min="0"
                    step="0.5"
                  />
                  {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.area ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                    min="0"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Size (sq ft)
                  </label>
                  <input
                    type="number"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    value={formData.parkingSpaces}
                    onChange={(e) => handleInputChange('parkingSpaces', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Images & Media</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Images *
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Upload Images
                  </button>
                  <p className="text-gray-500 text-sm mt-2">Select up to 10 images (JPG, PNG)</p>
                  {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Property Summary</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{formData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{formData.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium">${parseInt(formData.price).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-medium">{formData.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-medium">{formData.bathrooms}</p>
                  </div>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Images</p>
                    <p className="font-medium">{formData.images.length} uploaded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : step === 4 ? (isEdit ? 'Update Property' : 'Create Property') : 'Next'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProperty;
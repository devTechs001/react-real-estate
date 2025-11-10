import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaTimes } from 'react-icons/fa';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES } from '../../constants';

const PropertyForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    propertyType: initialData?.propertyType || '',
    listingType: initialData?.listingType || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    area: initialData?.area || '',
    yearBuilt: initialData?.yearBuilt || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'USA',
    amenities: initialData?.amenities || [],
    features: initialData?.features || [],
  });

  const [images, setImages] = useState(initialData?.images || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setImages([...images, ...newImages]);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a) => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.listingType) newErrors.listingType = 'Listing type is required';
    if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms is required';
    if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => {
            submitData.append(key, item);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach((image) => {
        if (image instanceof File) {
          submitData.append('images', image);
        }
      });

      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* Basic Information */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <Input
              label="Property Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g., Beautiful Family Home"
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              rows={6}
              placeholder="Describe your property..."
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="500000"
                required
              />

              <Select
                label="Property Type"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                error={errors.propertyType}
                options={PROPERTY_TYPES}
                required
              />
            </div>

            <Select
              label="Listing Type"
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              error={errors.listingType}
              options={LISTING_TYPES}
              required
            />
          </div>
        </section>

        {/* Property Details */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Property Details</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Bedrooms"
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              error={errors.bedrooms}
              min="0"
              required
            />

            <Input
              label="Bathrooms"
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              error={errors.bathrooms}
              min="0"
              step="0.5"
              required
            />

            <Input
              label="Area (sqft)"
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              error={errors.area}
              min="0"
              required
            />

            <Input
              label="Year Built"
              type="number"
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleChange}
              error={errors.yearBuilt}
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </section>

        {/* Location */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          <div className="space-y-4">
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="123 Main Street"
              required
            />

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                required
              />

              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
                required
              />

              <Input
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                error={errors.zipCode}
                required
              />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Amenities</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES.map((amenity) => (
              <Checkbox
                key={amenity}
                label={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
              />
            ))}
          </div>
        </section>

        {/* Images */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Images</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
          >
            <input {...getInputProps()} />
            <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Drag & drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Maximum 10 images (JPG, PNG)
            </p>
          </div>
          {errors.images && (
            <p className="text-red-600 text-sm mt-2">{errors.images}</p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview || image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            {initialData ? 'Update Property' : 'Add Property'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
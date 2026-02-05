import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/PropertyService';
import PropertyForm from '../components/forms/PropertyForm';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import '../styles/EditProperty.css';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getProperty(id);
      setProperty(data);
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/seller/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await propertyService.updateProperty(id, formData);
      toast.success('Property updated successfully!');
      navigate('/seller/properties');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update property');
      throw error;
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
      <PropertyForm initialData={property} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProperty;
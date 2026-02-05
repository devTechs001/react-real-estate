import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PropertyForm from '@/components/forms/PropertyForm';
import SEO from '@/components/common/SEO';
import '../styles/AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = (propertyId) => {
    navigate(`/seller/properties/${propertyId}`);
  };

  return (
    <>
      <SEO title="Add Property" description="List a new property for sale or rent" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600 mt-2">Fill in the details to list your property</p>
          </div>
          <PropertyForm onSuccess={handleSuccess} />
        </div>
      </div>
    </>
  );
};

export default AddProperty;

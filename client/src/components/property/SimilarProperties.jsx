import { useState, useEffect } from 'react';
import { propertyService } from '../../services/PropertyService';
import PropertyCard from './PropertyCard';
import Loader from '../common/Loader';

const SimilarProperties = ({ propertyId, propertyType, city }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProperties();
  }, [propertyId]);

  const fetchSimilarProperties = async () => {
    try {
      const data = await propertyService.getProperties({
        type: propertyType,
        city: city,
        limit: 3,
      });
      // Filter out current property
      const filtered = data.properties.filter((p) => p._id !== propertyId);
      setProperties(filtered.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch similar properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (properties.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
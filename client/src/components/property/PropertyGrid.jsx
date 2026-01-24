import { useState } from 'react';
import PropertyCard from './PropertyCard';
import Loader from '../common/Loader';
import Pagination from '../ui/Pagination';
import { FaThLarge, FaList } from 'react-icons/fa';

const PropertyGrid = ({ 
  properties, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  if (loading) {
    return <Loader />;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No properties found</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {properties.length} properties
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <FaThLarge size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <FaList size={20} />
          </button>
        </div>
      </div>

      {/* Properties */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            layout={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default PropertyGrid;
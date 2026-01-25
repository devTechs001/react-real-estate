import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyGrid from '../components/property/PropertyGrid';
import PropertyFilter from '../components/property/PropertyFilter';
import SearchForm from '../components/forms/SearchForm';
import { propertyService } from '../services/PropertyService';
import { SORT_OPTIONS } from '../constants';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProperties();
  }, [searchParams, currentPage, sortBy]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
        ...Object.fromEntries(searchParams),
      };

      const data = await propertyService.getProperties(params);
      setProperties(data.properties);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else {
          newParams.set(key, value);
        }
      }
    });
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Properties for Sale and Rent"
        description="Browse our extensive collection of properties for sale and rent"
      />

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
        <div className="container-custom px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-4 drop-shadow-lg">Find Your Dream Property</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
              Browse {properties.length > 0 && `${totalPages * 12}+`} premium properties across
              the country
            </p>
          </div>
          <SearchForm />
        </div>
      </div>

      <div className="container-custom py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <PropertyFilter
            onFilterChange={handleFilterChange}
            initialFilters={Object.fromEntries(searchParams)}
          />

          <div className="flex-1 flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <label className="text-sm font-semibold text-slate-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-blue-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <PropertyGrid
          properties={properties}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Properties;
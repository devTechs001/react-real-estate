import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { PROPERTY_TYPES, LISTING_TYPES } from '../../constants';

const SearchForm = ({ compact = false }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate(`/properties?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="location"
            value={searchData.location}
            onChange={handleChange}
            placeholder="Enter location..."
            className="input pl-10 w-full"
          />
        </div>
        <Button type="submit">
          <FaSearch className="mr-2" />
          Search
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="location"
            value={searchData.location}
            onChange={handleChange}
            placeholder="City, State, or Zip"
            className="input pl-10 w-full"
          />
        </div>

        <Select
          name="propertyType"
          value={searchData.propertyType}
          onChange={handleChange}
          options={PROPERTY_TYPES}
          placeholder="Property Type"
        />

        <Select
          name="listingType"
          value={searchData.listingType}
          onChange={handleChange}
          options={LISTING_TYPES}
          placeholder="For Sale/Rent"
        />

        <input
          type="number"
          name="minPrice"
          value={searchData.minPrice}
          onChange={handleChange}
          placeholder="Min Price"
          className="input"
        />

        <input
          type="number"
          name="maxPrice"
          value={searchData.maxPrice}
          onChange={handleChange}
          placeholder="Max Price"
          className="input"
        />

        <Select
          name="bedrooms"
          value={searchData.bedrooms}
          onChange={handleChange}
          options={[
            { value: '1', label: '1+ Beds' },
            { value: '2', label: '2+ Beds' },
            { value: '3', label: '3+ Beds' },
            { value: '4', label: '4+ Beds' },
            { value: '5', label: '5+ Beds' },
          ]}
          placeholder="Bedrooms"
        />
      </div>

      <Button type="submit" fullWidth>
        <FaSearch className="mr-2" />
        Search Properties
      </Button>
    </form>
  );
};

export default SearchForm;
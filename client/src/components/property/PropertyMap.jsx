import { useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const PropertyMap = ({ latitude, longitude, address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map (use Google Maps, Mapbox, or Leaflet)
    // This is a placeholder - implement with your preferred map library
    if (mapRef.current) {
      // Map initialization code here
      console.log('Map initialized for:', { latitude, longitude });
    }
  }, [latitude, longitude]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2">
        <FaMapMarkerAlt className="text-primary-600" />
        <h3 className="font-semibold">Location</h3>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4">{address}</p>
        
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <FaMapMarkerAlt className="text-4xl mx-auto mb-2" />
            <p>Map will be displayed here</p>
            <p className="text-sm">Integrate with Google Maps or Mapbox</p>
          </div>
        </div>

        {/* Nearby Places */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Schools</p>
            <p className="font-semibold">3 nearby</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Restaurants</p>
            <p className="font-semibold">12 nearby</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Transit</p>
            <p className="font-semibold">2 stations</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Shopping</p>
            <p className="font-semibold">5 nearby</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
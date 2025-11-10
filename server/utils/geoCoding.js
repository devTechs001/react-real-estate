import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }

    return null;
  } catch (error) {
    console.error('Geocoding Error:', error);
    return null;
  }
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return null;
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
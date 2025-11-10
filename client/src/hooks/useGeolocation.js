import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((state) => ({
        ...state,
        loaded: true,
        error: { message: 'Geolocation is not supported' },
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          loaded: true,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        setLocation((state) => ({
          ...state,
          loaded: true,
          error,
        }));
      }
    );
  }, []);

  return location;
};
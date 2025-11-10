import { createContext, useState, useEffect } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('compareList');
    if (saved) {
      setCompareList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToComparison = (property) => {
    if (compareList.length >= 4) {
      return { success: false, message: 'Maximum 4 properties can be compared' };
    }

    if (compareList.find((p) => p._id === property._id)) {
      return { success: false, message: 'Property already in comparison' };
    }

    setCompareList([...compareList, property]);
    return { success: true, message: 'Added to comparison' };
  };

  const removeFromComparison = (propertyId) => {
    setCompareList(compareList.filter((p) => p._id !== propertyId));
  };

  const clearComparison = () => {
    setCompareList([]);
  };

  const isInComparison = (propertyId) => {
    return compareList.some((p) => p._id === propertyId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
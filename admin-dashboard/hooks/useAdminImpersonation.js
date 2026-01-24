import { useState, useEffect } from 'react';

const useAdminImpersonation = () => {
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const startImpersonation = (user) => {
    setImpersonatedUser(user);
    setIsImpersonating(true);
    // Store original user info to restore later
    localStorage.setItem('originalUser', JSON.stringify(getCurrentUser()));
  };

  const endImpersonation = () => {
    const originalUser = JSON.parse(localStorage.getItem('originalUser'));
    setImpersonatedUser(null);
    setIsImpersonating(false);
    localStorage.removeItem('originalUser');
  };

  const getCurrentUser = () => {
    // In a real app, this would come from auth context or API
    return { id: 'admin123', name: 'Admin User', role: 'admin' };
  };

  return {
    impersonatedUser,
    isImpersonating,
    startImpersonation,
    endImpersonation,
    originalUser: JSON.parse(localStorage.getItem('originalUser'))
  };
};

export default useAdminImpersonation;
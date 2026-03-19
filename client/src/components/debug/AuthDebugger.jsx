import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthDebugger = () => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  
  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔐 Auth State Debug</h4>
      <div>Loading: {loading ? '✅' : '❌'}</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Admin: {isAdmin ? '✅' : '❌'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>Role: {user?.role || 'None'}</div>
      <div>Token: {localStorage.getItem('auth_token') ? '✅' : '❌'}</div>
    </div>
  );
};

export default AuthDebugger;

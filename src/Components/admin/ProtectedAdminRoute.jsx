
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminRole');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
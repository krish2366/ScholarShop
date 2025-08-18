import React, { useState, useEffect } from 'react';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const AdminHeader = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdminData(data.admin);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FaBell className="text-lg" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-gray-600 text-2xl" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{adminData?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{adminData?.roleLevel || localStorage.getItem('adminRole')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
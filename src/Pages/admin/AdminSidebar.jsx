import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaUserShield
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const adminRole = localStorage.getItem('adminRole');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminRole');
      navigate('/admin/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
    { name: 'Items', icon: FaBox, path: '/admin/items' },
    { name: 'Analytics', icon: FaChartLine, path: '/admin/analytics' },
    { name: 'Settings', icon: FaCog, path: '/admin/settings' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <FaUserShield className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-500 capitalize">{adminRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 text-lg" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95 transform transition-transform"
        >
          <FaSignOutAlt className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
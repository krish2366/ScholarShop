import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaUserShield,
  FaCommentDots  // ✅ Added for Feedback
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const adminRole = localStorage.getItem('adminRole');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
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
    { name: 'Feedback', icon: FaCommentDots, path: '/admin/feedback' }, // ✅ Added this line
    { name: 'Analytics', icon: FaChartLine, path: '/admin/analytics' },
    { name: 'Settings', icon: FaCog, path: '/admin/settings' }
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <FaUserShield className="text-orange-500 text-2xl mr-2" />
        <div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400 capitalize">{adminRole}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 mt-8 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
      >
        <FaSignOutAlt className="mr-3" />
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;

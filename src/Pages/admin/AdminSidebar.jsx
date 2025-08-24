import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaUserShield,
  FaCommentDots
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const adminRole = localStorage.getItem('adminRole');

  // Admin Settings state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    maintenanceMessage: 'System is under maintenance. Please try again later.',
    estimatedDowntime: 'Unknown'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/settings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSettings({
            maintenanceMode: data.settings.maintenanceMode,
            maintenanceMessage: data.settings.maintenanceMessage,
            estimatedDowntime: data.settings.estimatedDowntime
          });
        }
      } catch (error) {
        // fail silently for sidebar
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMessage,
          estimatedDowntime: settings.estimatedDowntime
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update settings');
      } else {
        alert('Settings updated successfully');
      }
    } catch (error) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
    { name: 'Items', icon: FaBox, path: '/admin/items' },
    { name: 'User Reports', icon: FaUserShield, path: '/admin/user-reports' }, // new row
    { name: 'Feedback', icon: FaCommentDots, path: '/admin/feedback' },
    { name: 'Analytics', icon: FaChartLine, path: '/admin/analytics' },
    { name: 'Settings', icon: FaCog, path: '/admin/settings' }
  ];

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded bg-gray-900 focus:outline-none focus:border-orange-500 text-white text-sm";
  const labelClass = "block text-xs mb-1 text-gray-200";
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
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
        onClick={async () => {
          try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/logout`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (error) {
            // ignore error
          } finally {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminId');
            localStorage.removeItem('adminRole');
            navigate('/admin/login');
          }
        }}
        className="flex items-center w-full px-4 py-3 mt-8 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
      >
        <FaSignOutAlt className="mr-3" />
        Logout
      </button>

      {/* Settings controls at the very bottom */}
      <div className="mt-10 pt-5 border-t border-gray-700">
        <div className="mb-2 text-xs font-bold text-gray-400">System Settings</div>
        {loading ? (
          <div className="text-xs text-orange-400 mb-2">Loading settings...</div>
        ) : (
          <>
            {/* Maintenance Mode Switch */}
            <label className={labelClass}>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => handleSettingChange('maintenanceMode', e.target.checked)}
                className="mr-2 accent-orange-500"
              />
              Maintenance Mode
            </label>
            {settings.maintenanceMode && (
              <div className="text-xs text-orange-400 mb-2">
                ⚠️ This will prevent regular users from accessing the site
              </div>
            )}
            {/* Maintenance Message */}
            <label className={labelClass} htmlFor="maintenanceMessage">
              Maintenance message
            </label>
            <textarea
              id="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={e => handleSettingChange('maintenanceMessage', e.target.value)}
              className={inputClass + " h-16 resize-none mb-2"}
              placeholder="Message to display to users during maintenance"
            />
            {/* Estimated Downtime */}
            <label className={labelClass} htmlFor="estimatedDowntime">
              Estimated downtime
            </label>
            <input
              id="estimatedDowntime"
              type="text"
              value={settings.estimatedDowntime}
              onChange={e => handleSettingChange('estimatedDowntime', e.target.value)}
              className={inputClass + " mb-3"}
              placeholder="e.g. 2 hours, 30 minutes, Unknown"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-bold transition-colors disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;

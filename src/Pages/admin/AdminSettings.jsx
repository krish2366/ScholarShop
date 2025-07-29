import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maxReportsPerUser: 10,
    autoVerifyUsers: false,
    allowGuestBrowsing: true,
    maintenanceMode: false,
    emailNotifications: true,
    reportReviewDeadline: 48,
    itemExpiryDays: 30,
    maxItemsPerUser: 50,
    minPasswordLength: 6,
    enableImageUpload: true,
    maintenanceMessage: 'System is under maintenance. Please try again later.',
    estimatedDowntime: 'Unknown'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      alert('Error fetching settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Settings updated successfully');
      } else {
        alert('Error updating settings');
      }
    } catch (error) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoVerifyUsers}
                    onChange={(e) => handleSettingChange('autoVerifyUsers', e.target.checked)}
                    className="mr-2"
                  />
                  Auto-verify new users
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.allowGuestBrowsing}
                    onChange={(e) => handleSettingChange('allowGuestBrowsing', e.target.checked)}
                    className="mr-2"
                  />
                  Allow guest browsing
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="mr-2"
                  />
                  Email notifications
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableImageUpload}
                    onChange={(e) => handleSettingChange('enableImageUpload', e.target.checked)}
                    className="mr-2"
                  />
                  Enable image uploads
                </label>
              </div>
            </div>
          </div>

          {/* Limits & Restrictions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Limits & Restrictions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max reports per user (daily)</label>
                <input
                  type="number"
                  value={settings.maxReportsPerUser}
                  onChange={(e) => handleSettingChange('maxReportsPerUser', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max items per user</label>
                <input
                  type="number"
                  value={settings.maxItemsPerUser}
                  onChange={(e) => handleSettingChange('maxItemsPerUser', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Minimum password length</label>
                <input
                  type="number"
                  value={settings.minPasswordLength}
                  onChange={(e) => handleSettingChange('minPasswordLength', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Report review deadline (hours)</label>
                <input
                  type="number"
                  value={settings.reportReviewDeadline}
                  onChange={(e) => handleSettingChange('reportReviewDeadline', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Item expiry (days)</label>
                <input
                  type="number"
                  value={settings.itemExpiryDays}
                  onChange={(e) => handleSettingChange('itemExpiryDays', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Maintenance Mode</h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="mr-2"
                  />
                  <span className={`font-medium ${settings.maintenanceMode ? 'text-red-600' : 'text-gray-600'}`}>
                    Enable maintenance mode
                  </span>
                </label>
                {settings.maintenanceMode && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ This will prevent regular users from accessing the site
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Maintenance message</label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleSettingChange('maintenanceMessage', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                  placeholder="Message to display to users during maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estimated downtime</label>
                <input
                  type="text"
                  value={settings.estimatedDowntime}
                  onChange={(e) => handleSettingChange('estimatedDowntime', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 2 hours, 30 minutes, Unknown"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

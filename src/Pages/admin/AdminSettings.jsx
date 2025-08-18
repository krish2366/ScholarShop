// ScholarShop-5/src/Pages/admin/AdminSettings.jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../../Components/AdminLayout.jsx';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
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
      const response = await fetch('/api/admin/settings', { // Ensure full URL
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Only set the maintenance-related settings
        setSettings({
          maintenanceMode: data.settings.maintenanceMode,
          maintenanceMessage: data.settings.maintenanceMessage,
          estimatedDowntime: data.settings.estimatedDowntime
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error); // Use console.error for debugging
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
      const response = await fetch('/api/admin/settings', { // Ensure full URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        // Only send the maintenance-related settings for update
        body: JSON.stringify({
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMessage,
          estimatedDowntime: settings.estimatedDowntime
        })
      });

      if (response.ok) {
        alert('Settings updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Error updating settings:', errorData); // Log error details
        alert(errorData.message || 'Error updating settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error); // Log network errors
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="text-center p-6 text-gray-600">Loading settings...</div></AdminLayout>;

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

        <div className="grid grid-cols-1 gap-6"> {/* Simplified grid for only one section */}
          {/* Maintenance Mode */}
          <div className="bg-white p-6 rounded-lg shadow">
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
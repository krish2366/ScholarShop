import { useState, useEffect } from 'react';

const MaintenancePage = () => {
  const [maintenanceInfo, setMaintenanceInfo] = useState({
    message: 'System is under maintenance. Please try again later.',
    estimatedDowntime: 'Unknown'
  });

  useEffect(() => {
    fetchMaintenanceInfo();
  }, []);

  const fetchMaintenanceInfo = async () => {
    try {
      const response = await fetch('/admin/maintenance');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceInfo(data);
        // If maintenance is not active, redirect to home or dashboard
        if (!data.maintenance) {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance info:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Under Maintenance
          </h1>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {maintenanceInfo.message}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Estimated downtime:</strong> {maintenanceInfo.estimatedDowntime}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              We apologize for any inconvenience. Please check back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            ScholarShop - Student Marketplace
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
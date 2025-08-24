import { useState, useEffect } from 'react';
import AdminLayout from '../../Components/AdminLayout.jsx';

const AdminUserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    type: 'all'
  });

  useEffect(() => {
    fetchUserReports();
  }, [filters]);

  const fetchUserReports = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/user-reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.userReports || []);
      }
    } catch (error) {
      console.error('Error fetching user reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId, action, notes) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/user-reports/${reportId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ action, notes })
      });

      if (response.ok) {
        fetchUserReports();
        setShowModal(false);
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleDismissReport = async (reportId, notes) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/user-reports/${reportId}/dismiss`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        fetchUserReports();
        setShowModal(false);
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Reports Management</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="p-2 border rounded"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
              className="p-2 border rounded"
            >
              <option value="all">All Types</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
              <option value="inappropriate_behavior">Inappropriate Behavior</option>
              <option value="scam">Scam</option>
              <option value="fake_profile">Fake Profile</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Report #{report.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Type: {report.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.complaint?.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {report.reporter?.userName || 'Anonymous'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {report.reportedUser?.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.reportedUser?.isVerified ? 'Verified' : 'Unverified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleResolveReport(report.id, 'user_warned', 'User warned for reported behavior')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDismissReport(report.id, 'Report dismissed after review')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">User Report Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Report ID:</strong> #{selectedReport.id}
                </div>
                <div>
                  <strong>Type:</strong> {selectedReport.type}
                </div>
                <div>
                  <strong>Reporter:</strong> {selectedReport.reporter?.userName}
                </div>
                <div>
                  <strong>Reported User:</strong> {selectedReport.reportedUser?.userName}
                </div>
                <div>
                  <strong>Status:</strong> {selectedReport.status}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="mb-4">
                <strong>Complaint:</strong>
                <p className="mt-2 p-3 bg-gray-100 rounded">{selectedReport.complaint}</p>
              </div>

              {selectedReport.roomId && (
                <div className="mb-4">
                  <strong>Chat Room ID:</strong> {selectedReport.roomId}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleResolveReport(selectedReport.id, 'user_warned', 'User warned for reported behavior')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDismissReport(selectedReport.id, 'Report dismissed after review')}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserReports;

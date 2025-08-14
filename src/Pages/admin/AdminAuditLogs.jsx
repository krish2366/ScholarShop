// ScholarShop-5/src/Pages/admin/AdminAuditLogs.jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { FaSearch, FaFilter, FaEye, FaDownload, FaCalendarAlt } from 'react-icons/fa';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days'); // This will need mapping to startDate/endDate for backend
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, dateRange]); // Re-fetch when filters change

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      // Map dateRange to startDate and endDate for the backend
      let startDate = null;
      let endDate = null;
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today

      if (dateRange === 'today') {
        startDate = now.toISOString();
        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(); // End of today
      } else if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        endDate = new Date().toISOString();
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        endDate = new Date().toISOString();
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        endDate = new Date().toISOString();
      }

      const params = new URLSearchParams({
        action: actionFilter,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        page: 1, // Reset to first page on filter change
        limit: 50 // You can add pagination controls later
      });

      const response = await fetch(`http://localhost:5000/admin/audit-logs?${params.toString()}`, { // Ensure full URL
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.auditLogs || []); // Backend returns 'auditLogs'
      } else {
        const errorData = await response.json();
        console.error('Error fetching audit logs:', errorData);
        alert(errorData.message || 'Error fetching audit logs');
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      alert('Error fetching audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    // This endpoint doesn't exist in backend, you'd need to implement it.
    // For now, let's just alert that it's not implemented.
    alert('Export logs functionality is not yet implemented on the backend.');
    // If you implement it, ensure it returns a CSV or similar file.
    // Example: fetch('/api/admin/audit-logs/export').then(res => res.blob()).then(blob => ...)
  };

  const filteredLogs = logs.filter(log =>
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.adminUsername?.toLowerCase().includes(searchTerm.toLowerCase()) || // Use adminUsername
    log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target?.toLowerCase().includes(searchTerm.toLowerCase()) // Include target in search
  );

  const getActionColor = (action) => {
    switch (action) {
      case 'ADMIN_REGISTERED': return 'bg-green-100 text-green-800';
      case 'USER_VERIFIED': return 'bg-green-100 text-green-800';
      case 'ITEM_UNBANNED': return 'bg-green-100 text-green-800';
      case 'SETTINGS_UPDATED': return 'bg-blue-100 text-blue-800';
      case 'ITEM_BANNED': return 'bg-red-100 text-red-800';
      case 'ITEM_DELETED': return 'bg-red-100 text-red-800';
      case 'REPORT_RESOLVED': return 'bg-emerald-100 text-emerald-800';
      case 'REPORT_DISMISSED': return 'bg-orange-100 text-orange-800';
      case 'ADMIN_LOGIN': return 'bg-purple-100 text-purple-800';
      case 'ATTEMPT_BAN_ITEM': return 'bg-yellow-100 text-yellow-800'; // Attempt actions
      case 'ATTEMPT_VERIFY_USER': return 'bg-yellow-100 text-yellow-800';
      case 'ATTEMPT_DELETE_ITEM': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <AdminLayout><div className="text-center p-6 text-gray-600">Loading audit logs...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <button
            onClick={handleExportLogs}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <FaDownload className="mr-2" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="ADMIN_LOGIN">Admin Login</option>
              <option value="ADMIN_REGISTERED">Admin Registered</option>
              <option value="VIEW_USERS">View Users</option>
              <option value="VIEW_ITEMS">View Items</option>
              <option value="VIEW_REPORTS">View Reports</option>
              <option value="VIEW_ANALYTICS">View Analytics</option>
              <option value="USER_VERIFIED">User Verified</option>
              <option value="USER_UNVERIFIED">User Unverified</option>
              <option value="ITEM_BANNED">Item Banned</option>
              <option value="ITEM_UNBANNED">Item Unbanned</option>
              <option value="ITEM_DELETED">Item Deleted</option>
              <option value="REPORT_RESOLVED">Report Resolved</option>
              <option value="REPORT_DISMISSED">Report Dismissed</option>
              <option value="SETTINGS_UPDATED">Settings Updated</option>
              {/* Add more specific actions as needed based on your backend logs */}
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No audit logs found for the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.adminUsername}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {log.action.replace(/_/g, ' ')} {/* Replace underscores for display */}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.target}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (if you want to add it later) */}
        {/*
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
        */}

        {/* Log Details Modal (if needed for 'View Details' button) */}
        {showModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Log Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>ID:</strong> {selectedLog.id}</p>
                <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
                <p><strong>Admin:</strong> {selectedLog.adminUsername}</p>
                <p><strong>Action:</strong> {selectedLog.action.replace(/_/g, ' ')}</p>
                <p><strong>Resource:</strong> {selectedLog.target}</p>
                <p><strong>Severity:</strong> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedLog.severity)}`}>{selectedLog.severity}</span></p>
                <p><strong>IP Address:</strong> {selectedLog.ipAddress}</p>
                <p><strong>Details:</strong> {selectedLog.details}</p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
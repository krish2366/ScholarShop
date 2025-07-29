// ScholarShop-5/src/Pages/admin/AdminReports.jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { FaFlag, FaEye, FaCheck, FaTimes, FaFilter, FaSearch, FaBan, FaRegThumbsDown, FaUserTimes } from 'react-icons/fa'; // All necessary icons

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter by status: pending, resolved, dismissed
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotes, setActionNotes] = useState(''); // For admin notes when resolving/dismissing

  useEffect(() => {
    fetchReports();
  }, [filter]); // Re-fetch when filter changes

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/admin/reports?status=${filter}`, { // Corrected URL prefix
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (report, actionType) => {
    setSelectedReport({ ...report, actionType }); // Store original report and intended action
    setActionNotes(''); // Clear notes for new action
    setShowModal(true);
  };

  const submitReportAction = async () => {
    if (!selectedReport) return;

    let endpoint;
    let body = { notes: actionNotes };

    // Map frontend action types to backend endpoints and parameters
    if (selectedReport.actionType === 'approve') {
      endpoint = `http://localhost:5000/admin/reports/${selectedReport.id}/resolve`;
      body.action = 'none'; // 'Approved' means report is resolved, no specific adverse action
    } else if (selectedReport.actionType === 'reject') {
      endpoint = `http://localhost:5000/admin/reports/${selectedReport.id}/dismiss`;
    } else if (selectedReport.actionType === 'ban_item') {
      endpoint = `http://localhost:5000/admin/reports/${selectedReport.id}/resolve`;
      body.action = 'item_banned';
    } else if (selectedReport.actionType === 'warn_user') {
        endpoint = `http://localhost:5000/admin/reports/${selectedReport.id}/resolve`;
        body.action = 'user_warned';
    } else if (selectedReport.actionType === 'ban_user') {
        endpoint = `http://localhost:5000/admin/reports/${selectedReport.id}/resolve`;
        body.action = 'user_banned';
    } else {
      console.error('Unknown action type:', selectedReport.actionType);
      alert('Invalid action selected.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'PUT', // Changed method to PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || `Report action (${selectedReport.actionType}) successfully recorded.`);
        setShowModal(false);
        setSelectedReport(null);
        fetchReports(); // Refresh the list
      } else {
        alert(data.message || `Error performing action (${selectedReport.actionType}) on report.`);
      }
    } catch (error) {
      console.error(`Error performing action (${selectedReport.actionType}) on report:`, error);
      alert(`An error occurred while performing action: ${selectedReport.actionType}`);
    }
  };

  const filteredReports = reports.filter(report =>
    report.complaint?.toLowerCase().includes(searchTerm.toLowerCase()) || // Use complaint field
    report.reporter?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || // Access nested reporter.userName
    report.Item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) // Access nested Item.title
  );

  // Status colors should match backend `status` enum values
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800'; // Changed from 'approved'
      case 'dismissed': return 'bg-red-100 text-red-800'; // Changed from 'rejected'
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Type colors (assuming report.type exists now)
  const getTypeColor = (type) => {
    switch (type) {
      case 'spam': return 'bg-orange-100 text-orange-800';
      case 'inappropriate': return 'bg-red-100 text-red-800';
      case 'fraud': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <AdminLayout><div className="text-center p-6">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option> {/* Changed from approved */}
              <option value="dismissed">Dismissed</option> {/* Changed from rejected */}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported Item/User
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
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Report #{report.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.complaint?.substring(0, 50)}...
                        </div>
                        <div className="text-xs text-gray-400">
                          By: {report.reporter?.userName || 'Anonymous'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.Item ? (
                          <>
                            <div className="font-medium">Item: {report.Item.title}</div>
                            <div className="text-gray-500">Seller: {report.Item.Owner?.userName}</div>
                          </>
                        ) : (
                          <div className="font-medium">User: {report.reporter?.userName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleActionClick(report, 'approve')}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Approve Report (No Action Taken)"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleActionClick(report, 'reject')}
                            className="text-red-600 hover:text-red-900 mr-3"
                            title="Dismiss Report"
                          >
                            <FaTimes />
                          </button>
                          <button
                            onClick={() => handleActionClick(report, 'ban_item')}
                            className="text-orange-600 hover:text-orange-900"
                            title="Ban Item"
                          >
                            <FaBan />
                          </button>
                          {/* Optionally add buttons for warn user / ban user if needed */}
                          {/*
                          <button
                            onClick={() => handleActionClick(report, 'warn_user')}
                            className="text-purple-600 hover:text-purple-900 ml-3"
                            title="Warn User"
                          >
                            <FaRegThumbsDown />
                          </button>
                          <button
                            onClick={() => handleActionClick(report, 'ban_user')}
                            className="text-red-800 hover:text-red-900 ml-3"
                            title="Ban User"
                          >
                            <FaUserTimes />
                          </button>
                          */}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Details & Action Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">
                {selectedReport.actionType === 'approve' ? 'Approve Report' :
                 selectedReport.actionType === 'reject' ? 'Dismiss Report' :
                 selectedReport.actionType === 'ban_item' ? 'Ban Item' :
                 'Report Details'}
              </h3>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="font-medium">Report ID:</label>
                  <p className="text-gray-600">#{selectedReport.id}</p>
                </div>
                <div>
                  <label className="font-medium">Type:</label>
                  <p className="text-gray-600">{selectedReport.type}</p>
                </div>
                <div>
                  <label className="font-medium">Complaint:</label>
                  <p className="text-gray-600">{selectedReport.complaint}</p>
                </div>
                <div>
                  <label className="font-medium">Reporter:</label>
                  <p className="text-gray-600">{selectedReport.reporter?.userName || 'Anonymous'}</p>
                </div>
                <div>
                  <label className="font-medium">Reported:</label>
                  <p className="text-gray-600">
                    {selectedReport.Item
                      ? `Item: ${selectedReport.Item.title} (ID: ${selectedReport.Item.id})`
                      : `User: ${selectedReport.reporter?.userName}`
                    }
                  </p>
                </div>
                {selectedReport.Item && (
                    <div>
                        <label className="font-medium">Item Owner:</label>
                        <p className="text-gray-600">
                            {selectedReport.Item.Owner?.userName || 'N/A'}
                        </p>
                    </div>
                )}
                <div>
                  <label className="font-medium">Status:</label>
                  <p className="text-gray-600">{selectedReport.status}</p>
                </div>
                {selectedReport.resolvedAt && (
                    <div>
                        <label className="font-medium">Resolved At:</label>
                        <p className="text-gray-600">{new Date(selectedReport.resolvedAt).toLocaleString()}</p>
                    </div>
                )}
                {selectedReport.resolver && (
                    <div>
                        <label className="font-medium">Resolved By:</label>
                        <p className="text-gray-600">{selectedReport.resolver.username}</p>
                    </div>
                )}
                {selectedReport.action && selectedReport.action !== 'none' && (
                    <div>
                        <label className="font-medium">Action Taken:</label>
                        <p className="text-gray-600">{selectedReport.action.replace(/_/g, ' ')}</p>
                    </div>
                )}
                {selectedReport.adminNotes && (
                    <div>
                        <label className="font-medium">Admin Notes:</label>
                        <p className="text-gray-600">{selectedReport.adminNotes}</p>
                    </div>
                )}
              </div>

              {/* Action specific input for notes */}
              {(selectedReport.actionType === 'approve' ||
                selectedReport.actionType === 'reject' ||
                selectedReport.actionType === 'ban_item' ||
                selectedReport.actionType === 'warn_user' ||
                selectedReport.actionType === 'ban_user') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter notes for this action..."
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                {(selectedReport.actionType === 'approve' ||
                  selectedReport.actionType === 'reject' ||
                  selectedReport.actionType === 'ban_item' ||
                  selectedReport.actionType === 'warn_user' ||
                  selectedReport.actionType === 'ban_user') && (
                  <button
                    onClick={submitReportAction}
                    className={`px-4 py-2 rounded
                      ${selectedReport.actionType === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' :
                        selectedReport.actionType === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white' :
                        selectedReport.actionType === 'ban_item' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                        selectedReport.actionType === 'warn_user' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                        selectedReport.actionType === 'ban_user' ? 'bg-red-800 hover:bg-red-900 text-white' :
                        'bg-blue-600 hover:bg-blue-700 text-white'
                      }
                    `}
                  >
                    {selectedReport.actionType === 'approve' ? 'Approve' :
                     selectedReport.actionType === 'reject' ? 'Dismiss' :
                     selectedReport.actionType === 'ban_item' ? 'Ban Item' :
                     selectedReport.actionType === 'warn_user' ? 'Warn User' :
                     selectedReport.actionType === 'ban_user' ? 'Ban User' :
                     'Submit Action'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
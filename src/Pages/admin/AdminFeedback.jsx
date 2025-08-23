import React, { useState, useEffect } from 'react';
import { FaStar, FaCheck, FaTimes, FaEye, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    rating: 'all'
  });
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
    fetchAnalytics();
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        ...filters,
        limit: 50
      }).toString();
      
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/feedback?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/feedback/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/feedback/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublic: true, isFeatured: false })
      });
      
      if (response.ok) {
        fetchFeedbacks();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error approving feedback:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/feedback/${id}/reject`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes: 'Rejected by admin' })
      });
      fetchFeedbacks();
      fetchAnalytics();
    } catch (error) {
      console.error('Error rejecting feedback:', error);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/feedback/${id}/toggle-featured`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchFeedbacks();
      fetchAnalytics();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedFeedbacks.length === 0) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/feedback/bulk/approve`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          feedbackIds: selectedFeedbacks,
          isPublic: true 
        })
      });
      setSelectedFeedbacks([]);
      fetchFeedbacks();
      fetchAnalytics();
    } catch (error) {
      console.error('Error bulk approving feedbacks:', error);
    }
  };

  const viewFeedbackDetails = (feedback) => {
    setModalFeedback(feedback);
    setShowModal(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback Management</h1>
        <p className="text-gray-600">Review and manage user feedback</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Feedback</h3>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalFeedbacks}</p>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold text-orange-600">{analytics.pendingFeedbacks}</p>
            <div className="text-xs text-orange-500 mt-1">Needs attention</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">{analytics.approvedFeedbacks}</p>
            <div className="text-xs text-green-500 mt-1">{analytics.approvalRate}% approval rate</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="text-2xl font-bold text-blue-600">{analytics.averageRating}/5</p>
            <div className="flex text-yellow-400 mt-1">
              {[...Array(Math.round(analytics.averageRating))].map((_, i) => (
                <FaStar key={i} className="h-3 w-3" />
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Featured</h3>
            <p className="text-2xl font-bold text-purple-600">{analytics.featuredFeedbacks}</p>
            <div className="text-xs text-purple-500 mt-1">Highlighted reviews</div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="suggestion">Suggestion</option>
            </select>

            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {selectedFeedbacks.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedFeedbacks.length} selected
              </span>
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
              >
                <FaCheck className="mr-1" />
                Bulk Approve
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeedbacks(feedbacks.filter(f => f.status === 'pending').map(f => f.id));
                      } else {
                        setSelectedFeedbacks([]);
                      }
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
              {feedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedback.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedFeedbacks.includes(feedback.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeedbacks(prev => [...prev, feedback.id]);
                          } else {
                            setSelectedFeedbacks(prev => prev.filter(id => id !== feedback.id));
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{feedback.name}</div>
                      <div className="text-sm text-gray-500">{feedback.email}</div>
                      <div className="flex items-center mt-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({feedback.rating})</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {feedback.feedback}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {feedback.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                        feedback.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feedback.status}
                      </span>
                      {feedback.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewFeedbackDetails(feedback)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {feedback.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(feedback.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(feedback.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {feedback.status === 'approved' && (
                        <button
                          onClick={() => handleToggleFeatured(feedback.id)}
                          className={`p-1 rounded ${feedback.isFeatured ? 'text-purple-600 hover:text-purple-900' : 'text-gray-400 hover:text-purple-600'}`}
                          title={feedback.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          <FaStar />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Feedback Details */}
      {showModal && modalFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Feedback Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="mt-1 text-sm text-gray-900">{modalFeedback.name} ({modalFeedback.email})</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <div className="flex items-center mt-1">
                    {[...Array(modalFeedback.rating)].map((_, i) => (
                      <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({modalFeedback.rating}/5)</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{modalFeedback.category}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feedback</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{modalFeedback.feedback}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    modalFeedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                    modalFeedback.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {modalFeedback.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(modalFeedback.createdAt).toLocaleString()}</p>
                </div>

                {modalFeedback.reviewer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {modalFeedback.reviewer.username} on {new Date(modalFeedback.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                {modalFeedback.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(modalFeedback.id);
                        setShowModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(modalFeedback.id);
                        setShowModal(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;

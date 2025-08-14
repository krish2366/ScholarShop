
import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    users: null,
    items: null,
    activity: null
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, itemRes, activityRes] = await Promise.all([
        fetch('${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/analytics/users', { headers }),
        fetch('${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/analytics/items', { headers }),
        fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/admin/analytics/activity?days=${timeRange}`, { headers })
      ]);

      const [userData, itemData, activityData] = await Promise.all([
        userRes.json(),
        itemRes.json(),
        activityRes.json()
      ]);

      setAnalytics({
        users: userData.analytics,
        items: itemData.analytics,
        activity: activityData.analytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Platform insights and statistics</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <FaUsers className="text-white text-xl" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : analytics.users?.totalUsers?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-green-600">
                +{analytics.users?.recentUsers || 0} new this period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <FaBox className="text-white text-xl" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Items</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : analytics.items?.totalItems?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-green-600">
                +{analytics.items?.recentItems || 0} new this period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <FaChartLine className="text-white text-xl" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Verification Rate</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : `${analytics.users?.verificationRate || 0}%`}
              </p>
              <p className="text-xs text-gray-500">User verification</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                  <FaBox className="text-white text-xl" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Banned Items</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : analytics.items?.bannedItems?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500">Items under review</p>
            </div>
          </div>

          {/* Charts and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Activity Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.activity?.dailyStats?.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{day.date}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm">{day.users} users</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">{day.items} items</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items by Category</h3>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.items?.categoryStats?.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <span className="text-gray-700">{cat.category}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{
                              width: `${(cat.count / analytics.items.availableItems) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Registrations</h3>
              <div className="space-y-3">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  analytics.activity?.recentUserRegistrations?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{user.userName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Item Submissions</h3>
              <div className="space-y-3">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  analytics.activity?.recentItemSubmissions?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          By {item.User?.userName} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isAvailable ? 'Active' : 'Banned'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
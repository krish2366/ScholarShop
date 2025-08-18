import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaUserCheck, 
  FaExclamationTriangle,
  FaEye,
  FaCog
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [analytics, setAnalytics] = useState({
    users: null,
    items: null,
    activity: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile();
    fetchAnalytics();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdminData(data.admin);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, itemRes, activityRes] = await Promise.all([
        fetch('/api/admin/analytics/users', { headers }),
        fetch('/api/admin/analytics/items', { headers }),
        fetch('/api/admin/analytics/activity', { headers })
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

  const statsCards = [
    {
      title: 'Total Users',
      value: analytics.users?.totalUsers || 0,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      change: `+${analytics.users?.recentUsers || 0} this week`
    },
    {
      title: 'Total Items',
      value: analytics.items?.totalItems || 0,
      icon: FaBox,
      color: 'from-green-500 to-green-600',
      change: `+${analytics.items?.recentItems || 0} this week`
    },
    {
      title: 'Verified Users',
      value: analytics.users?.verifiedUsers || 0,
      icon: FaUserCheck,
      color: 'from-purple-500 to-purple-600',
      change: `${analytics.users?.verificationRate || 0}% verification rate`
    },
    {
      title: 'Banned Items',
      value: analytics.items?.bannedItems || 0,
      icon: FaExclamationTriangle,
      color: 'from-red-500 to-red-600',
      change: 'Items under review'
    }
  ];

  const quickActions = [
    {
      title: 'View All Users',
      description: 'Manage user accounts and verification',
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      path: '/admin/users'
    },
    {
      title: 'View All Items',
      description: 'Monitor and moderate item listings',
      icon: FaBox,
      color: 'from-green-500 to-green-600',
      path: '/admin/items'
    },
    {
      title: 'Analytics',
      description: 'View detailed platform analytics',
      icon: FaChartLine,
      color: 'from-purple-500 to-purple-600',
      path: '/admin/analytics'
    },
    {
      title: 'Settings',
      description: 'Configure platform settings',
      icon: FaCog,
      color: 'from-gray-500 to-gray-600',
      path: '/admin/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {adminData?.username || 'Admin'}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening on your platform today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="text-white text-xl" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md cursor-pointer hover:scale-105 active:scale-95 transform transition-transform duration-200"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} w-fit mb-4`}>
                    <action.icon className="text-white text-lg" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Registrations</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.activity?.recentUserRegistrations?.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{user.userName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <FaEye className="text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Item Submissions</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.activity?.recentItemSubmissions?.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
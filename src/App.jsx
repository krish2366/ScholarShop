import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Post from './Pages/Post.jsx'
import Signup from './Pages/Signup.jsx'
import Profile from './Pages/Profile.jsx'
import Item from './Pages/Item.jsx';
import Chat from './Pages/Chat.jsx';
import AvailableBuyers from './Pages/AvailableBuyers.jsx';
import { useState } from 'react';
import UpdateItem from './Pages/UpdateItem.jsx';
import CategoryProductsPage from './Pages/Category.jsx';
import AboutUs from './Pages/AboutUs.jsx'; 
import AuthSuccess from "./Pages/AuthSuccess.jsx";
import FeedbackPage from './Pages/Feedback.jsx';
import AdminLogin from './Pages/admin/AdminLogin.jsx';
import AdminDashboard from './Pages/admin/AdminDashboard.jsx';
import AdminUsers from './Pages/admin/AdminUsers.jsx';
import AdminItems from './Pages/admin/AdminItems.jsx';
import AdminAnalytics from './Pages/admin/AdminAnalytics.jsx';
import AdminSettings from './Pages/admin/AdminSettings.jsx';
import AdminReports from './Pages/admin/AdminReports.jsx';
import AdminNotifications from './Pages/admin/AdminNotifications.jsx';
import AdminAuditLogs from './Pages/admin/AdminAuditLogs.jsx';
import AdminProtectedRoute from './Components/AdminProtectedRoute.jsx';
import MaintenancePage from './Pages/MaintenancePage.jsx';

function App() {

  const [buyerId, setBuyerId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/update-item/:itemId" element={<UpdateItem/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/availableBuyers/:itemId" element={<AvailableBuyers setBuyerId={setBuyerId} />} />
        <Route path="/chat/:sellerId/:productId" element={<Chat buyerId={buyerId} />} />
        <Route path="/item/:id" element={<Item/>} />
        <Route path="/category/:category" element={<CategoryProductsPage/>} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/items" element={
          <AdminProtectedRoute>
            <AdminItems />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <AdminProtectedRoute>
            <AdminAnalytics />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminProtectedRoute requiredRole="super_admin">
            <AdminSettings />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <AdminProtectedRoute>
            <AdminReports />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <AdminProtectedRoute>
            <AdminNotifications />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/audit-logs" element={
          <AdminProtectedRoute requiredRole="super_admin">
            <AdminAuditLogs />
          </AdminProtectedRoute>
        } />
        
        {/* Maintenance Page */}
        <Route path="/maintenance" element={<MaintenancePage />} />

        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </Router>
  )
}


export default App
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home'
import Login from './Pages/Login'
import Post from './Pages/Post'
import Signup from './Pages/Signup'
import Profile from './Pages/Profile'
import Item from './Pages/Item';
import Chat from './Pages/Chat';
import AvailableBuyers from './Pages/AvailableBuyers';
import { useState } from 'react';
import UpdateItem from './Pages/UpdateItem';
import CategoryProductsPage from './Pages/Category';
import AboutUs from './Pages/AboutUs'; 
import AuthSuccess from "./Pages/AuthSuccess";
import FeedbackPage from './Pages/Feedback';
import AdminLogin from './Pages/admin/AdminLogin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

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
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/items" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        
        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </Router>
  )
}

export default App

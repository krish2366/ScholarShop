import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {

  const [buyerId, setBuyerId] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/update-item/:id" element={<UpdateItem/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/availableBuyers/:itemId" element={<AvailableBuyers setBuyerId={setBuyerId} />} />
        <Route path="/chat/:sellerId/:productId" element={<Chat buyerId={buyerId} />} />
        <Route path="/item/:id" element={<Item/>} />
        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

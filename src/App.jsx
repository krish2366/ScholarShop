import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home'
import Login from './Pages/Login'
import Post from './Pages/Post'
import Signup from './Pages/Signup'
import Profile from './Pages/Profile'
import Item from './Pages/Item';
import Chat from './Pages/Chat';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:sellerId/:productId" element={<Chat/>} />
        <Route path="/item/:id" element={<Item/>} />
        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

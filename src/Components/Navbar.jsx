import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.svg";
import searchIcon from "../assets/search.svg";
import bell from "../assets/bell.svg";
import user from "../assets/user.svg";
import CollapsableNavbar from "./CollapsableNavbar";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-5 bg-orange-400 text-white w-full shadow-sm">

      <div className="flex items-center gap-4">
        <CollapsableNavbar />
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="scholar shop" className="h-12" />
          <h1
            className="text-2xl text-white font-bold"
            // style={{ fontFamily: "Arial" }}
          >
            ScholarShop
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-lg font-semibold text-white hover:text-orange-200"
        >
          Home
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products"
            className="border-2 rounded-full bg-[#FFF4DC] p-1 pl-4 pr-8 w-64 outline-none text-[#333333] placeholder-[#333333]"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <img src={searchIcon} alt="Search Icon" className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <img src={bell} alt="notification" className="h-6 w-6" />
          {localStorage.getItem("accessToken") ? (
            <Link 
              to="/profile"
              className="bg-[#FFF4DC] text-[#333333] h-10 w-10 rounded-full flex items-center justify-center">
              <img src={user} alt="user" className="h-6 w-6" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-gray-800 hover:text-white text-lg font-semibold  px-3 py-1  bg-orange-200 rounded-xl"
            >
              Login
            </Link>
          )}
      </div>
      
    </nav>
  );
}

export default Navbar;
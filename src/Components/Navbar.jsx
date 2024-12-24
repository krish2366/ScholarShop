import React from "react";
import logo from "../assets/logo1.svg";
import searchIcon from "../assets/search.svg";
import bell from "../assets/bell.svg";
import user from "../assets/user.svg";
import CollapsableNavbar from "./CollapsableNavbar";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-5 bg-[#0057A1] text-white">
      <div className="flex items-center gap-10">

        <CollapsableNavbar/>




        <img src={logo} alt="scholar shop" className="h-16" />
        <h1 className="text-3xl italic font-bold">ScholarShop</h1>
      </div>

      <div className="flex items-center gap-10">
        <a href="/" className="text-xl font-semibold">
          {" "}
          Home
        </a>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products"
            className="border-2  rounded-full bg-[#ADBFD6] p-1 pl-5 ml-5 outline-none text-white placeholder-white"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pl-3">
            <img src={searchIcon} alt="Search Icon" className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <img src={bell} alt="notification" />
        <button className="bg-[#ABD2EB] text-white h-11 w-11 rounded-full flex items-center justify-center">
          <img src={user} alt="user" className="h-7 w-7" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

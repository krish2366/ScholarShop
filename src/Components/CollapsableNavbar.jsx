import React, { useState } from "react";
import menu from "../assets/menu.svg";
import logo from "../assets/logo1.svg";
import home from "../assets/Right.svg";
import user from "../assets/user.svg";
import cart from "../assets/cart.svg";
import categories from "../assets/category.svg";
import abtus from "../assets/users.svg";
import feedback from "../assets/write.svg";
import logout from "../assets/logout.svg";

function CollapsableNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      <div className="text-center p-4">
        <button onClick={toggleDrawer} className="text-white">
          <img src={menu} alt="menu" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 z-40 h-full w-[27rem] bg-orange-300 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex gap-5 items-center text-white uppercase bg-orange-400 p-4">
          <img src={logo} alt="scholar shop" className="h-16" />
          <p className="text-3xl font-bold">ScholarShop</p>
        </div>

        <div className="py-4 px-5 overflow-y-auto font-medium space-y-2">

          <NavItem icon={home} label="Home" />
          <NavItem icon={user} label="My Profile" />
          <NavItem icon={abtus} label="About Us" />
          <NavItem icon={feedback} label="Feedback" />
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-white rounded-lg hover:bg-orange-400 w-full"
          >
            <img src={logout} alt="logout" className="h-6 w-6" />
            <span className="ms-3">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

const NavItem = ({ icon, label }) => (
  <a
    href="#"
    className="flex items-center p-2 text-white rounded-lg hover:bg-orange-400"
  >
    <img src={icon} alt={label} className="h-6 w-6" />
    <span className="ms-3">{label}</span>
  </a>
);

export default CollapsableNavbar;

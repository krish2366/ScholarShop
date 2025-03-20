import React from "react";
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
  return (
    <>
      <div>
        {/* drawer init and show */}
        <div className="text-center">
          <button
            className="text-white font-medium rounded-lg text-sm px-5 py-2.5 "
            type="button"
            data-drawer-target="drawer-navigation"
            data-drawer-show="drawer-navigation"
            aria-controls="drawer-navigation"
          >
            <img
              src={menu}
              alt="menu"
              data-drawer-target="drawer-navigation"
              data-drawer-show="drawer-navigation"
              aria-controls="drawer-navigation"
            />
          </button>
        </div>

        {/* drawer component */}
        <div
          id="drawer-navigation"
          className="fixed top-0 left-0 z-40 h-screen  overflow-y-auto transition-transform -translate-x-full  w-[27rem] bg-orange-300"
          tabIndex={-1}
          aria-labelledby="drawer-navigation-label"
        >
          <h2
            id="drawer-navigation-label"
            className=" flex gap-5 items-center text-base font-semibold text-white uppercase bg-orange-400 p-4 "
          >
            <img src={logo} alt="scholar shop" className="h-16" />
            <p className="text-3xl font-bold">ScholarShop</p>
          </h2>

          <div className="py-4 overflow-y-auto">
            <ul className="space-y-2 px-5 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={home} alt="home" className="h-6 w-6"/>
                  <span className="ms-3">Home</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={user} alt="user" className="h-6 w-6"/>
                  <span className="ms-3">My Profile</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={cart} alt="cart" className="h-6 w-6"/>
                  <span className="ms-3">My Cart</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={categories} alt="listing" className="h-6 w-6"/>
                  <span className="ms-3">My Listings</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={abtus} alt="aboutus" className="h-6 w-6"/>
                  <span className="ms-3">About Us</span>
                </a>
              </li>
              
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={feedback} alt="feedback" className="h-6 w-6"/>
                  <span className="ms-3">Feedback</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-white rounded-lg  hover:bg-orange-400  "
                >
                  <img src={logout} alt="logout" className="h-6 w-6"/>
                  <span className="ms-3">Logout</span>
                </a>
              </li>
                 
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default CollapsableNavbar;

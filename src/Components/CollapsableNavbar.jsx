import { useState } from "react";
import logo from "../assets/logo1.svg";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { HomeIcon, LogOutIcon, PenLineIcon, User2, UsersRound } from "lucide-react"
import { Link } from "react-router-dom";

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
    <nav className="">
      <div className="text-center">
        <button onClick={toggleDrawer} className="text-white">
          <Bars3Icon className="h-10 w-8 text-black" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 z-40 h-full w-[27rem] bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex gap-5 items-center text-white uppercase bg-gray-100 p-4">
          <img src={logo} alt="scholar shop" className="h-16" />
          <p className="text-3xl font-bold text-[#F47C26]">ScholarShop</p>
        </div>

        <div className="py-4 px-5 overflow-y-auto font-medium space-y-2">

          <NavItem icon={HomeIcon} label="Home" href="/" />
          <NavItem icon={User2} label="My Profile" href="/profile"/>
          <NavItem icon={UsersRound} label="About Us" href="/about"/>
          <NavItem icon={PenLineIcon} label="Feedback" href="/feedback"/>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-black hover:text-orange-500 rounded-lg hover:bg-gray-200"
          >
            <LogOutIcon className="h-6 w-6 text-orange-500" />
            <span className="ms-3">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ icon : Icon, label, href }) => (
  <Link
    to={href}
    className="flex items-center p-2 text-black hover:text-orange-500 rounded-lg hover:bg-gray-200"
  >
    <Icon className="h-6 w-6 text-orange-500" />
    <span className="ms-3 ">{label}</span>
  </Link>
);

export default CollapsableNavbar;

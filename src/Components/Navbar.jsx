import { Link } from "react-router-dom";
import logo from "../assets/logo1.svg";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import CollapsableNavbar from "./CollapsableNavbar.jsx";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-gray-50 shadow-md sm:px-5 w-full">

      {/* Left side: Burger Menu & Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <CollapsableNavbar />
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img src={logo} alt="scholar shop" className="h-10 sm:h-12" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#F47C26]">ScholarShop</h1>
        </Link>
      </div>

      {/* Right side: Profile/Login */}
      <div className="flex items-center">
        {localStorage.getItem("accessToken") ? (
          <Link 
            to="/profile"
            className="flex items-center justify-center rounded-full size-9">
            <UserCircleIcon className="text-black size-full" />
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 text-base font-semibold text-gray-800 transition-colors bg-gray-200 rounded-lg sm:text-lg hover:bg-gray-300"
          >
            Login
          </Link>
        )}
      </div>
      
    </nav>
  );
}

export default Navbar;
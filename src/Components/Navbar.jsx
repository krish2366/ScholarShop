import { Link } from "react-router-dom";
import logo from "../assets/logo1.svg";
import { HomeIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import CollapsableNavbar from "./CollapsableNavbar.jsx";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-5 py-4 bg-gray-50 shadow-md p-4 text-white w-full ">

      <div className="flex items-center gap-4">

        <CollapsableNavbar />
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="scholar shop" className="h-12" />
          <h1 className="text-2xl font-bold text-[#F47C26]">ScholarShop</h1>
        </Link>

      </div>


      <div className="flex items-center gap-6">

        <Link
          to="/"
          className="text-lg font-semibold text-white hover:text-orange-200"
        >
          <HomeIcon className="h-6 w-6 inline-block mr-1 text-black" />
        </Link>

        {localStorage.getItem("accessToken") ? (
          <Link 
            to="/profile"
            className="size-9 rounded-full flex items-center justify-center">
            <UserCircleIcon className="size-full text-black" />
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-gray-800 hover:text-white text-lg font-semibold  px-3 py-1  bg-gray-200 rounded-xl"
          >
            Login
          </Link>
        )}
      </div>
      
    </nav>
  );
}

export default Navbar;
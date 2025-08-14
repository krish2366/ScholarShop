import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import lginimg from "../assets/login.svg";
import google from "../assets/google_logo.svg";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [useEmail, setUseEmail] = useState(true);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    const data = {
      password,
      ...(useEmail ? { email } : { phoneNumber })
    };

    try {
      const res = await fetch("${import.meta.env.VITE_MAIN_BACKEND_URL}/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const resData = await res.json();
      console.log(resData);

      if(resData.success){
        localStorage.setItem("accessToken",resData.accessToken);
        localStorage.setItem("userId",resData.user.id);
        navigate("/");
      }else{
        setError(resData.message || "Invalid credentials");
      }

    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }finally{
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4DC] flex flex-col">
      <Navbar/>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 md:py-24">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={lginimg}
            alt="login"
            className="w-full md:max-w-md lg:max-w-lg object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#F47C26] text-center">
            Login to Your Account
          </h2>
          <button
            className="w-full bg-white font-semibold rounded-lg p-2 mt-4 flex items-center justify-center gap-4 shadow-md"
            onClick={() => window.location.href = "${import.meta.env.VITE_MAIN_BACKEND_URL}/auth/google"}
          >
            <img src={google} alt="google" className="h-6" />
            <span className="text-[#333333]">Login with Google</span>
          </button>
          <div className="flex justify-center mt-4">
            <button
              className={`px-4 py-2 mx-2 rounded-md ${
                useEmail ? "bg-[#F47C26] text-white" : "bg-gray-200 text-[#333333]"
              }`}
              onClick={() => setUseEmail(true)}
            >
              Email Login
            </button>
            <button
              className={`px-4 py-2 mx-2 rounded-md ${
                !useEmail ? "bg-[#F47C26] text-white" : "bg-gray-200 text-[#333333]"
              }`}
              onClick={() => setUseEmail(false)}
            >
              Phone Login
            </button>
          </div>
          <form className="mt-6" onSubmit={handleClick}>
            {useEmail ? (
              <input
                className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <input
                className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            )}
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#F47C26] text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-[#333333] hover:underline">
              Forgot Password?
            </a>
            <p className="mt-2 text-[#333333]">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#F47C26] underline">
                Sign Up
              </Link>
            </p>
            {/* Add Admin Login Link */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Are you an administrator?</p>
              <Link 
                to="/admin/login" 
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

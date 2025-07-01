import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import supimg from "../assets/signup.svg";
// import google from "../assets/google.svg"; // Removed as the file does not exist
import Navbar from "../Components/Navbar"; 


function Signup() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');   
  const [useEmail, setUseEmail] = useState(true);
  const [error, setError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError === "auth_failed") {
      setError("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

    const handleClick = async (e) => {
      e.preventDefault();
      setIsSigningUp(true);
      setError("");

      if (password !== cnfPassword) {
        setError("Passwords do not match");
        setIsSigningUp(false);
        return;
      } 
        
      const data = {
        userName:name ,
        ...(useEmail ? { email } : { phoneNumber }),
        password,
      }

      try {
        const res = await fetch("http://localhost:5000/auth/register",{
          method: "POST",
          headers:{
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(data),
        })

        const resData = await res.json();
        console.log(resData);

        if(resData.success){
          localStorage.setItem("accessToken", resData.accessToken);
          localStorage.setItem("userId", resData.userId);
          navigate("/");
        }
      } catch (error) {
        console.log(error)
        setError("Something went wrong. Please try again.")
      }finally{
        setIsSigningUp(false);
      }
    }




  return (
    <div className="min-h-screen bg-[#FFF4DC] flex flex-col">
      <Navbar />
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 md:py-24">

        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={supimg}
            alt="signup"
            className="w-full md:max-w-md lg:max-w-lg object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#F47C26] text-center">
            Sign Up for ScholarShop
          </h2>

          <div className="flex justify-center mt-4">
            <button
              className={`px-4 py-2 mx-2 rounded-md ${
                useEmail ? "bg-[#F47C26] text-white" : "bg-gray-200 text-[#333333]"
              }`}
              onClick={() => setUseEmail(true)}
            >
              Email Signup
            </button>
            <button
              className={`px-4 py-2 mx-2 rounded-md ${
                !useEmail ? "bg-[#F47C26] text-white" : "bg-gray-200 text-[#333333]"
              }`}
              onClick={() => setUseEmail(false)}
            >
              Phone Signup
            </button>
          </div>

          <form className="mt-6" onSubmit={handleClick}>

            <input
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            <input
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
              type="password"
              placeholder="Confirm Password"
              value={cnfPassword}
              onChange={(e) => setCnfPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#F47C26] text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </button>

          </form>

          <div className="flex flex-col items-center">
            <button
              className="w-full bg-white font-semibold rounded-lg p-2 mt-4 flex items-center justify-center gap-4 shadow-md"
              onClick={() => window.location.href = "http://localhost:5000/auth/google"} // Ensure backend URL matches
            >
              {/* Removed google image as the file does not exist */}
              <span className="text-[#333333]">Sign Up with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-[#333333]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#F47C26] underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

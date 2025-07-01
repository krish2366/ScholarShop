
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Store the token in localStorage
      localStorage.setItem("accessToken", token);
      
      // Optionally decode the JWT to get user ID
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem("userId", payload.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      
      // Redirect to home page
      navigate("/");
    } else {
      // If no token, redirect to signup with error
      navigate("/signup?error=auth_failed");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#FFF4DC] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#F47C26] mb-4">
          Completing Authentication...
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F47C26] mx-auto"></div>
      </div>
    </div>
  );
}

export default AuthSuccess;
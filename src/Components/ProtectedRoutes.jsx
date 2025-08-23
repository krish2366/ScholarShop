// ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { DotsSpinner } from "./Spinner.jsx";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <DotsSpinner/>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;

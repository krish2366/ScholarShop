// AuthProvider.jsx
import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const { login, logout, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      logout();
      return;
    }

    axios
      .get(`${import.meta.env.VITE_MAIN_BACKEND_URL}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data)
        setUser(res.data.user);
        login(token);
      })
      .catch(() => {
        logout();
        localStorage.removeItem("accessToken");
      })
      .finally(() => {
        setLoading(false); // ✅ done checking
      });
  }, []);

  return children;
};

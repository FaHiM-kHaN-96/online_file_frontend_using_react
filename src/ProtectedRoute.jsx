import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem("jwt");

    console.log("token for /me " + token);

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // ✅ Send GET request with token in headers (Authorization Bearer)
    axios
      .get("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      })
      .then((res) => { 
        if (res.status === 200 && res.data.username) {
          setIsAuthenticated(true);
          console.log("Session valid:", res.data.username);
        } else {
          setIsAuthenticated(false);
          console.log("Session invalid");
        }
      })
      .catch((err) => {
        setIsAuthenticated(false);
        console.log("Error validating token:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

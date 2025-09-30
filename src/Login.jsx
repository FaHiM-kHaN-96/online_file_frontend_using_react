import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "./Login.css";

// ✅ Set base URL for your JWT backend
axios.defaults.baseURL = "http://localhost:8080";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null); 
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePassword = () => setPasswordVisible(!passwordVisible);

  // Login function (JWT flow)
  const login = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    try {
      // 1️⃣ Login POST request with JSON
      const loginResponse = await axios.post(
        "/api/login",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login Response:", loginResponse.data);

      if (loginResponse.status === 200) {
        const token = loginResponse.data.token; // ✅ JWT token from backend

        // Save token in localStorage
        localStorage.setItem('jwt', token);
        console.log("jwt", token)
        // 2️⃣ Fetch current user info using token
       
      
        alert("Login successful!");
        navigate("/FileManager"); 
      }
    } catch (err) {
      console.error("Login error:", err.response || err);
      setError(err.response?.data?.message || "Login failed! Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <div className="login-navbar">
        <Link to="/">← Home</Link>
        <span>| ONLineFile</span>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <h2 className="text-center mb-4">Login</h2>

        {/* Error message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Username Field */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="password-toggle-btn"
            >
              <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button type="button" onClick={login} className="login-btn-primary">
          Login
        </button>

        {/* Links */}
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup" className="login-link">Signup</Link>
        </p>
        <p className="text-center mt-1">
          <Link to="/forgot-password" className="login-link">Forgot Password?</Link>
        </p>

        {/* Display logged-in user info */}
        {userData && (
          <div className="mt-3 alert alert-success">
            <h5>Welcome, {userData.username}!</h5>
            <p>Roles: {userData.roles?.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

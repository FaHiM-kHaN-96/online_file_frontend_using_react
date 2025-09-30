import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "./Login.css"; // reuse for signup styling

axios.defaults.baseURL = "http://localhost:8080"; // ✅ backend base URL

const Signup = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      // ✅ call JWT backend signup API
      await axios.post(
        "/api/signup",
        { username, email, password }, // match backend DTO
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error details:", error.response);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <div className="login-navbar">
        <Link to="/">← Home</Link>
        <span>| ONLineFile</span>
      </div>

      {/* Signup Card */}
      <div className="login-card">
        <h2 className="text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
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
                required
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

          {/* Submit */}
          <button type="submit" className="login-btn-primary">
            Signup
          </button>

          {/* Links */}
          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="login-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

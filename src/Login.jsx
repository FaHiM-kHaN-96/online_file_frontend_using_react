import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaHome,
  FaUser,
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaShieldAlt,
  FaCloud,
} from "react-icons/fa";
import "./Login.css"; 

// ✅ Set base URL for your JWT backend
axios.defaults.baseURL = "http://192.168.1.183:8080"; 
 
const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

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
        localStorage.setItem("jwt", token);
        console.log("jwt", token);

        // Success animation (optional)
        showSuccessAnimation();

        // Redirect after short delay
        setTimeout(() => {
          setIsLoading(false);
          navigate("/FileManager");
        }, 1500);
      }
    } catch (err) {
      console.error("Login error:", err.response || err);
      setError(
        err.response?.data?.message ||
          "Login failed! Please check your credentials."
      );
      setIsLoading(false);
    }
  };

  const showSuccessAnimation = () => {
    console.log("Login successful - showing animation");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header/Navigation */}
      <div className="login-header">
        <Link to="/" className="back-home-btn">
          <FaArrowLeft className="btn-icon" />
          Back to Home
        </Link>
        <div className="brand-section">
          <FaCloud className="brand-icon" />
          <span className="brand-name">ONLineFile</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="login-main-content">
        <div className="login-card glass-effect">
          {/* Card Header */}
          <div className="login-card-header">
            <div className="welcome-section">
              <FaShieldAlt className="welcome-icon" />
              <h2>Welcome Back!</h2>
              <p>Sign in to access your files and documents</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger error-alert" role="alert">
              <div className="alert-content">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  className="form-control custom-input"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="input-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control custom-input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="password-toggle-btn"
                  disabled={isLoading}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="input-focus-border"></div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="form-options">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={login}
              className="login-btn-primary"
              disabled={isLoading}
            >
              <FaUser className="btn-icon" />
              Sign In
            </button>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Sign Up Link */}
            <div className="signup-section">
              <p>Don't have an account?</p>
              <Link to="/signup" className="signup-link">
                <span>Create Account</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div className="security-note">
            <FaShieldAlt className="security-icon" />
            <small>Your data is securely encrypted and protected</small>
          </div>
        </div>

        {/* Features Side Panel */}
        <div className="features-panel glass-effect">
          <h4>Why Choose ONLineFile?</h4>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>
              <div className="feature-content">
                <h6>Secure Cloud Storage</h6>
                <p>Your files are safely stored with enterprise-grade encryption</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-share"></i>
              </div>
              <div className="feature-content">
                <h6>Easy File Sharing</h6>
                <p>Share files securely with time-limited access links</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-qr-code"></i>
              </div>
              <div className="feature-content">
                <h6>QR Code Access</h6>
                <p>Generate QR codes for quick file access and sharing</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-device-ssd"></i>
              </div>
              <div className="feature-content">
                <h6>Cross-Platform</h6>
                <p>Access your files from any device, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Loading Overlay (covers full screen until request completes) */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <FaCloud className="spinner-icon" />
          </div>
          <p>Signing you in...</p>
        </div>
      )}
    </div>
  );
};

export default Login;

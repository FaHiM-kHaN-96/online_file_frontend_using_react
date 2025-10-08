import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,

  FaUser,
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaUserPlus,
  FaCloud,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import "./Signup.css";



const Signup = () => { 
  const [fullname, setUsername] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPassword = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); 
    const isLongEnough = password.length >= 8;

    const strengthPoints = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean).length;

    if (strengthPoints <= 2) return "weak";
    if (strengthPoints <= 4) return "medium";
    return "strong";
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case "weak": return "#dc3545";
      case "medium": return "#ffc107";
      case "strong": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case "weak": return "Weak password";
      case "medium": return "Medium strength";
      case "strong": return "Strong password";
      default: return "Enter a password";
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
    
      await axios.post(
        "/api/signup",
        { fullname, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Success state
      setIsSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Signup error details:", error.response);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="signup-container">
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
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Header/Navigation */}
      <div className="signup-header">
        <Link to="/" className="back-home-btn">
          <FaArrowLeft className="btn-icon" />
          Back to Home
        </Link>
        <div className="brand-section">
          <FaCloud className="brand-icon" />
          <span className="brand-name">ONLineFile</span>
        </div>
      </div>

      {/* Main Signup Content */}
      <div className="signup-main-content">
        {/* Signup Card */}
        <div className="signup-card glass-effect">
          {/* Card Header */}
          <div className="signup-card-header">
            <div className="welcome-section">
              <FaUserPlus className="welcome-icon" />
              <h2>Create Account</h2>
              <p>Join thousands of users managing their files securely</p>
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="fullname" className="form-label">
                <FaUser className="input-icon" />
                Username
              </label>
              <div className="input-container">
                <input
                  type="text"
                  className="form-control custom-input"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Choose a username"
                  disabled={isLoading}
                  required
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  className="form-control custom-input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
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
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  required
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="password-strength">
                  <div 
                    className="strength-bar"
                    style={{
                      width: passwordStrength === "weak" ? "33%" : 
                             passwordStrength === "medium" ? "66%" : "100%",
                      backgroundColor: getPasswordStrengthColor(passwordStrength)
                    }}
                  ></div>
                  <span 
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor(passwordStrength) }}
                  >
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
              )}

              {/* Password Requirements */}
              <div className="password-requirements">
                <small>Password must contain:</small>
                <ul>
                  <li className={password.length >= 6 ? "met" : ""}>
                    <FaCheckCircle className="requirement-icon" />
                    At least 6 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "met" : ""}>
                    <FaCheckCircle className="requirement-icon" />
                    One uppercase letter
                  </li>
                  <li className={/\d/.test(password) ? "met" : ""}>
                    <FaCheckCircle className="requirement-icon" />
                    One number
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <FaLock className="input-icon" />
                Confirm Password
              </label>
              <div className="input-container">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  className="form-control custom-input"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="password-toggle-btn"
                  disabled={isLoading}
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="input-focus-border"></div>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="password-match">
                  {password === confirmPassword ? (
                    <span className="match-success">
                      <FaCheckCircle className="me-1" />
                      Passwords match
                    </span>
                  ) : (
                    <span className="match-error">
                      <i className="bi bi-x-circle me-1"></i>
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="form-group terms-agreement">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="termsAgreement"
                  required
                  disabled={isLoading}
                />
                <label className="form-check-label" htmlFor="termsAgreement">
                  I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
                </label>
              </div>
            </div>

            {/* Signup Button */}
            <button 
              type="submit" 
              className="signup-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus className="btn-icon" />
                  Create Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Already have an account?</span>
            </div>

            {/* Login Link */}
            <div className="login-section">
              <Link to="/login" className="login-link">
                <span>Sign In to Your Account</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </form>

          {/* Security Note */}
          <div className="security-note">
            <FaShieldAlt className="security-icon" />
            <small>We never share your personal information with third parties</small>
          </div>
        </div>

        {/* Benefits Side Panel */}
        <div className="benefits-panel glass-effect">
          <h4>Join Our Community</h4>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>
              <div className="benefit-content">
                <h6>Free Storage</h6>
                <p>Get started with generous free cloud storage space</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="benefit-content">
                <h6>Bank-Level Security</h6>
                <p>Your files are protected with military-grade encryption</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-lightning"></i>
              </div>
              <div className="benefit-content">
                <h6>Lightning Fast</h6>
                <p>Upload and download files at incredible speeds</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-phone"></i>
              </div>
              <div className="benefit-content">
                <h6>Access Anywhere</h6>
                <p>Use our web app on any device with internet connection</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="benefit-content">
                <h6>Easy Sharing</h6>
                <p>Share files securely with friends and colleagues</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="benefit-content">
                <h6>No Limits</h6>
                <p>Unlimited file uploads with no restrictions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <FaUserPlus className="spinner-icon" />
          </div>
          <p>Creating your account...</p>
        </div>
      )}

      {/* Success Overlay */}
      {isSuccess && !isLoading && (
        <div className="success-preview">
          <div className="success-content">
            <FaCheckCircle className="success-icon" />
            <p>Account created successfully! Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;

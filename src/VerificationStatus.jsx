import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./VerificationStatus.css";
import {
  FaEnvelope,
  FaHome,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaCloud,
} from "react-icons/fa";
import "./Login.css";

const VerificationStatus = () => {
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

      {/* Main Content */}
      <div className="login-main-content">
        <div className="verification-card glass-effect">
          {/* Card Header */}
          <div className="verification-card-header">
            <div className="verification-icon">
              <FaEnvelope className="envelope-icon" />
              <FaCheckCircle className="check-icon" />
            </div>
            <h2>Check Your Email</h2>
            <p>We've sent a verification link to your email address</p>
          </div>

          {/* Verification Content */}
          <div className="verification-content">
            <div className="verification-steps">
              <div className="verification-step">
                <div className="step-icon">
                  <FaEnvelope />
                </div>
                <div className="step-content">
                  <h5>1. Open your email</h5>
                  <p>Check your inbox for a message from ONLineFile</p>
                </div>
              </div>

              <div className="verification-step">
                <div className="step-icon">
                  <FaCheckCircle />
                </div>
                <div className="step-content">
                  <h5>2. Click the verification link</h5>
                  <p>Click the link in the email to verify your account</p>
                </div>
              </div>

              <div className="verification-step">
                <div className="step-icon">
                  <FaHome />
                </div>
                <div className="step-content">
                  <h5>3. Start using ONLineFile</h5>
                  <p>Return here and sign in to access your account</p>
                </div>
              </div>
            </div>

            {/* Additional Help */}
            <div className="verification-help">
              <div className="help-item">
                <FaClock className="help-icon" />
                <div className="help-content">
                  <h6>Didn't receive the email?</h6>
                  <p>
                    Check your spam folder or wait a few minutes. The email 
                    may take 1-5 minutes to arrive.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="verification-actions">
              <Link to="/login" className="verification-btn-primary">
                Return to Sign In
              </Link>
              <button className="verification-btn-secondary">
                Resend Verification Email
              </button>
            </div>
          </div>

          {/* Support Note */}
          <div className="support-note">
            <p>
              Need help?{" "}
              <Link to="/support" className="support-link">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>

        {/* Features Side Panel */}
        <div className="features-panel glass-effect">
          <h4>Why Verify Your Email?</h4>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="feature-content">
                <h6>Secure Your Account</h6>
                <p>Protect your files with verified email access</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-bell"></i>
              </div>
              <div className="feature-content">
                <h6>Important Notifications</h6>
                <p>Receive security alerts and file updates</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-arrow-clockwise"></i>
              </div>
              <div className="feature-content">
                <h6>Password Recovery</h6>
                <p>Reset your password if you forget it</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>
              <div className="feature-content">
                <h6>Full Access</h6>
                <p>Unlock all features of your ONLineFile account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
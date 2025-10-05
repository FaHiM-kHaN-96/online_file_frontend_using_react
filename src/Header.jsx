import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCloud,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaShieldAlt
} from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
    setIsMobileMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/login", label: "Login", icon: <FaSignInAlt /> },
    { path: "/signup", label: "Sign Up", icon: <FaUserPlus /> }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Background Effects */}
      <div className="header-background">
        <div className="header-glow"></div>
      </div>

      <div className="header-container">
        {/* Logo/Brand */}
        <Link to="/" className="brand">
          <div className="logo">
            <FaCloud className="logo-icon" />
            <span className="logo-text">ONLineFile</span>
          </div>
          <div className="logo-badge">Pro</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${activeLink === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <div className="nav-indicator"></div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* About Button */}
        <div className="header-actions">
          <Link to="/about" className="about-btn">
            <FaInfoCircle className="btn-icon" />
            <span>About</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-backdrop" onClick={toggleMobileMenu}></div>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <div className="mobile-logo">
              <FaCloud className="logo-icon" />
              <span>ONLineFile</span>
            </div>
            <button 
              className="mobile-close-btn"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <ul className="mobile-nav-list">
            {navigationItems.map((item) => (
              <li key={item.path} className="mobile-nav-item">
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${activeLink === item.path ? 'active' : ''}`}
                  onClick={toggleMobileMenu}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-text">{item.label}</span>
                  {activeLink === item.path && (
                    <div className="mobile-nav-indicator"></div>
                  )}
                </Link>
              </li>
            ))}
            
            {/* Additional Mobile Links */}
            <li className="mobile-nav-item">
              <a href="/features" className="mobile-nav-link">
                <span className="mobile-nav-icon"><FaCog /></span>
                <span className="mobile-nav-text">Features</span>
              </a>
            </li>
            <li className="mobile-nav-item">
              <a href="/security" className="mobile-nav-link">
                <span className="mobile-nav-icon"><FaShieldAlt /></span>
                <span className="mobile-nav-text">Security</span>
              </a>
            </li>
          </ul>

          <div className="mobile-nav-footer">
            <div className="security-badge">
              <FaShieldAlt className="badge-icon" />
              <span>Bank-Level Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress">
        <div className="scroll-progress-bar"></div>
      </div>
    </header>
  );
};
 
export default Header;
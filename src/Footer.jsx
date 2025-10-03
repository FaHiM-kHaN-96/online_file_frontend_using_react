import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCloud,
  FaHeart,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaArrowUp,
  FaShieldAlt,
  FaRocket,
  FaUsers,
  FaCode,
  FaMobileAlt,
  FaGlobeAmericas
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/features", label: "Features" },
    { path: "/security", label: "Security" },
    { path: "/pricing", label: "Pricing" }
  ];

  const supportLinks = [
    { path: "/help", label: "Help Center" },
    { path: "/contact", label: "Contact Us" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/cookies", label: "Cookie Policy" }
  ];

  const socialLinks = [
    { 
      icon: <FaGithub />, 
      url: "https://github.com", 
      label: "GitHub",
      color: "#333"
    },
    { 
      icon: <FaTwitter />, 
      url: "https://twitter.com", 
      label: "Twitter",
      color: "#1DA1F2"
    },
    { 
      icon: <FaLinkedin />, 
      url: "https://linkedin.com", 
      label: "LinkedIn",
      color: "#0077B5"
    },
    { 
      icon: <FaEnvelope />, 
      url: "mailto:support@onlinefile.com", 
      label: "Email",
      color: "#D44638"
    }
  ];

  const features = [
    { icon: <FaShieldAlt />, text: "Bank-Level Security" },
    { icon: <FaRocket />, text: "Lightning Fast" },
    { icon: <FaUsers />, text: "Team Collaboration" },
    { icon: <FaCode />, text: "Developer Friendly" },
    { icon: <FaMobileAlt />, text: "Mobile Optimized" },
    { icon: <FaGlobeAmericas />, text: "Global Access" }
  ];

  return (
    <footer className="app-footer">
      {/* Background Effects */}
      <div className="footer-background">
        <div className="footer-glow"></div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <Link to="/" className="footer-brand">
              <FaCloud className="brand-icon" />
              <div className="brand-text">
                <span className="brand-name">ONLineFile</span>
                <span className="brand-tagline">Secure Cloud Storage</span>
              </div>
            </Link>
            <p className="brand-description">
              Enterprise-grade file storage and sharing platform trusted by 
              thousands of users worldwide. Secure, fast, and reliable.
            </p>
            
            {/* Features Grid */}
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              {supportLinks.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="footer-section">
            <h4 className="footer-title">Connect With Us</h4>
            <div className="contact-info">
              <p className="contact-item">
                <FaEnvelope className="contact-icon" />
                support@onlinefile.com
              </p>
              <p className="contact-item">
                <FaMobileAlt className="contact-icon" />
                +1 (555) 123-4567
              </p>
            </div>
            
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.label}
                  style={{ '--social-color': social.color }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="newsletter">
              <h5>Stay Updated</h5>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <FaEnvelope />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                &copy; {currentYear} ONLineFile v2.0. Made with{" "}
                <FaHeart className="heart-icon" /> by our amazing team.
              </p>
            </div>
            
            <div className="footer-badges">
              <div className="badge">
                <FaShieldAlt className="badge-icon" />
                <span>SSL Secured</span>
              </div>
              <div className="badge">
                <FaRocket className="badge-icon" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      {/* Wave Decoration */}
      <div className="footer-wave">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          className="wave-svg"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25" 
            className="wave-fill"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5" 
            className="wave-fill"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="wave-fill"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
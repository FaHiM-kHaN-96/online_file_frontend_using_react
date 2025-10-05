import React, { useState, useEffect } from "react";
import "./App.css";
import Header from './Header';
import Footer from './Footer';
import { Link } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaShieldAlt,
  FaGlobeAmericas,
  FaShareAlt,
  FaQrcode, 
  FaMobileAlt,
  FaRocket,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaPause
} from "react-icons/fa";

const Body = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Bank-Level Security",
      description: "Military-grade encryption protects your files with the highest security standards",
      color: "#4CAF50"
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Access Anywhere",
      description: "Access your files from any device, anywhere in the world with seamless synchronization",
      color: "#2196F3"
    },
    {
      icon: <FaShareAlt />,
      title: "Smart Sharing",
      description: "Share files securely with time-limited links and customizable permissions",
      color: "#FF9800"
    },
    {
      icon: <FaQrcode />,
      title: "QR Code Access",
      description: "Generate QR codes for instant file access and easy sharing with others",
      color: "#9C27B0"
    },
    {
      icon: <FaCloudUploadAlt />,
      title: "Unlimited Storage",
      description: "Store all your files with generous cloud storage space and no file size limits",
      color: "#00BCD4"
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices with our responsive design and mobile app",
      color: "#E91E63"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500K+", label: "Files Stored" },
    { number: "99.9%", label: "Uptime" },
    { number: "256-bit", label: "Encryption" }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="body-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      <Header />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-glow"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <div className="badge-container">
                  <span className="hero-badge">
                    <FaRocket className="badge-icon" />
                    Trusted by Thousands
                  </span>
                </div>
                
                <h1 className="hero-title">
                  Secure Cloud Storage
                  <span className="gradient-text"> for Everyone</span>
                </h1>
                
                <p className="hero-description">
                  Store, share, and access your files securely from anywhere. 
                  Experience enterprise-grade security with user-friendly cloud storage 
                  that works seamlessly across all your devices.
                </p>

                <div className="hero-buttons">
                  <Link to="/signup" className="btn btn-primary">
                    <span>Get Started Free</span>
                    <FaArrowRight className="btn-icon" />
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </div>

                {/* Stats */}
                <div className="hero-stats">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Showcase */}
              <div className="feature-showcase">
                <div className="showcase-header">
                  <h3>Why Choose Us?</h3>
                  <button 
                    className="animation-toggle"
                    onClick={toggleAnimation}
                    aria-label={isPlaying ? "Pause animation" : "Play animation"}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
                
                <div className="feature-display">
                  <div className="feature-icon" style={{ color: features[currentFeature].color }}>
                    {features[currentFeature].icon}
                  </div>
                  <div className="feature-content">
                    <h4>{features[currentFeature].title}</h4>
                    <p>{features[currentFeature].description}</p>
                  </div>
                </div>

                <div className="feature-indicators">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentFeature ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentFeature(index);
                        setIsPlaying(false);
                      }}
                      aria-label={`Show feature ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Everything You Need for File Management</h2>
              <p>Powerful features designed to make file storage and sharing simple and secure</p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card glass-effect">
                  <div className="feature-card-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-card-hover"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content glass-effect">
              <div className="cta-text">
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of users who trust ONLineFile with their important files and documents</p>
              </div>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-large">
                  <span>Create Free Account</span>
                  <FaArrowRight className="btn-icon" />
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Sign In to Existing Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2>Loved by Users Worldwide</h2>
              <p>See what our community has to say about their experience</p>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card glass-effect">
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                  <p>"ONLineFile has revolutionized how our team collaborates. The security features give us peace of mind while the sharing capabilities make workflow seamless."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">SD</div>
                  <div className="author-info">
                    <strong>Sarah Davis</strong>
                    <span>Project Manager</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card glass-effect">
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                  <p>"As a freelance designer, I need to share large files with clients regularly. ONLineFile makes this process incredibly smooth and professional."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">MJ</div>
                  <div className="author-info">
                    <strong>Mike Johnson</strong>
                    <span>Freelance Designer</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card glass-effect">
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                  <p>"The mobile access and QR code features are game-changers. I can quickly share files during meetings without any hassle."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">EC</div>
                  <div className="author-info">
                    <strong>Emily Chen</strong>
                    <span>Business Consultant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Body;
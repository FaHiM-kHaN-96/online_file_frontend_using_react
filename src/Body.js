import React from "react";
import "./App.css";
import "./Header.css"
import "./Footer.css"
import Header from './Header';
import Footer from './Footer';
import { Link } from "react-router-dom";

const Body = () => {
 return (
    <main >
      <div className="app-container">
      <Header/>
      <div className="container">
        <div className="hero-section">
          <div className="text-center py-5">
            <h1>Welcome to ONLineFile</h1>
            <p className="lead mt-3">Secure Cloud Storage for All Your Files</p>
            <div className="mt-4">
             <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
              <Link to="/Signup" className="btn btn-secondary btn-lg">Signup</Link>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="row features">
          <div className="col-md-4">
            <div className="feature-card text-center">
              <h3>Secure Storage</h3>
              <p>Your files are encrypted and securely stored in the cloud with bank-level security.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card text-center">
              <h3>Access Anywhere</h3>
              <p>Access your files from any device, anywhere in the world with an internet connection.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card text-center">
              <h3>Easy Sharing</h3>
              <p>Share files and folders with others quickly and easily with customizable permissions.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      </div>
    </main>
  );
};

export default Body;

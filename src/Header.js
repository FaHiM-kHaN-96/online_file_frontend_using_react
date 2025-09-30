import React from "react";

import "./Header.css";

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">ONLineFile</div>
      <a href="about_us.html" className="btn about-btn">
        About Us
      </a>
    </header>
  );
};

export default Header;

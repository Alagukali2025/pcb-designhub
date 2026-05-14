import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-copyright">
          <span className="copyright-symbol">©</span>
          <span className="copyright-year">{currentYear}</span>
          <span className="brand-name">PCB RULES</span>.
          <span className="rights-reserved">All Rights Reserved.</span>
        </div>
        <div className="footer-technical-info">
          <span className="system-status">System Operational</span>
          <span className="version-tag">v1.2.0-STABLE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

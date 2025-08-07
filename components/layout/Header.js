/**
 * Header component with logo and admin indicator
 */

import React from 'react';

const Header = ({
  isAdminMode = false,
  children,
  onLogoClick
}) => {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-wrapper">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="logo"
          />
        </div>
        {isAdminMode && (
          <div className="admin-indicator">
            🔧 Admin Mode - Delete visits enabled
          </div>
        )}
      </div>
      {children}
    </header>
  );
};

export default Header;

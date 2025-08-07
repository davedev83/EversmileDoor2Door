/**
 * Breadcrumb navigation component
 */

import React from 'react';

const Breadcrumb = ({ onBackClick, children }) => {
  return (
    <div className="breadcrumb-container">
      <button className="breadcrumb-btn" onClick={onBackClick}>
        ← Back to Visits
      </button>
      {children}
      
      <style jsx>{`
        .breadcrumb-container {
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          padding: 12px 20px;
          position: relative;
        }

        .breadcrumb-btn {
          background: none;
          border: none;
          color: #127BB8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .breadcrumb-btn:hover {
          color: #0f6ba3;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Breadcrumb;

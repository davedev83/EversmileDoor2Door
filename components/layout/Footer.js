/**
 * Footer component with minimalistic logout
 */

import React from 'react';

const Footer = ({ onLogout, showLogout = false }) => {
  if (!showLogout) return null;

  return (
    <footer className="footer">
      <button 
        className="logout-link"
        onClick={onLogout}
        title="Logout"
      >
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>

      <style jsx>{`
        .footer {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logout-link {
          background: none;
          border: none;
          color: #999;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .logout-link:hover {
          color: #666;
          background: #f8f9fa;
        }

        .logout-link:active {
          transform: translateY(1px);
        }

        .logout-link svg {
          width: 12px;
          height: 12px;
          opacity: 0.7;
        }

        @media (max-width: 480px) {
          .footer {
            padding: 12px 16px;
          }
          
          .logout-link {
            font-size: 12px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

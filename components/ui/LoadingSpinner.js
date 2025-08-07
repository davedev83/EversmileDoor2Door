/**
 * Loading spinner component
 */

import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '20px', height: '20px' };
      case 'medium':
        return { width: '40px', height: '40px' };
      case 'large':
        return { width: '60px', height: '60px' };
      default:
        return { width: '40px', height: '40px' };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className="loading-container">
      <div className="spinner" />
      <div className="loading-message">{message}</div>
      
      <style jsx>{`
        .loading-container {
          text-align: center;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: ${sizeStyles.width};
          height: ${sizeStyles.height};
          border: 3px solid #e0e0e0;
          border-top: 3px solid #127BB8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-message {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

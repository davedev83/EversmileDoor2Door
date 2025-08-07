/**
 * Reusable Button component
 */

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #127BB8, #0f6ba3)',
          color: 'white',
          border: 'none'
        };
      case 'secondary':
        return {
          background: '#f8f9fa',
          color: '#333',
          border: '2px solid #e0e0e0'
        };
      case 'danger':
        return {
          background: '#dc3545',
          color: 'white',
          border: 'none'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #127BB8, #0f6ba3)',
          color: 'white',
          border: 'none'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '14px'
        };
      case 'medium':
        return {
          padding: '12px 20px',
          fontSize: '16px'
        };
      case 'large':
        return {
          padding: '16px 24px',
          fontSize: '18px'
        };
      default:
        return {
          padding: '12px 20px',
          fontSize: '16px'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
      {...props}
    >
      {children}
      
      <style jsx>{`
        .btn {
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          background: ${variantStyles.background};
          color: ${variantStyles.color};
          border: ${variantStyles.border};
          padding: ${sizeStyles.padding};
          font-size: ${sizeStyles.fontSize};
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(18, 123, 184, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
};

export default Button;

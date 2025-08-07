/**
 * Reusable Input component
 */

import React from 'react';

const Input = ({ 
  label, 
  error, 
  required = false,
  type = 'text',
  className = '',
  ...props 
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
      
      <style jsx>{`
        .input-group {
          margin-bottom: 25px;
        }

        .input-group label {
          display: block;
          font-size: 16px;
          font-weight: 500;
          color: #555;
          margin-bottom: 8px;
        }

        .required {
          color: #dc3545;
          margin-left: 4px;
        }

        .input-group input {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          transition: all 0.3s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .input-group input:focus {
          outline: none;
          border-color: #127BB8;
          box-shadow: 0 0 0 3px rgba(18, 123, 184, 0.1);
        }

        .input-group input.error {
          border-color: #dc3545;
        }

        .input-group input.error:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }

        .error-message {
          display: block;
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default Input;

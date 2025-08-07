/**
 * Reusable Select component
 */

import React from 'react';

const Select = ({ 
  label, 
  error, 
  required = false,
  options = [],
  placeholder = 'Select an option',
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
      <select
        className={error ? 'error' : ''}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

        .input-group select {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          transition: all 0.3s ease;
          font-family: inherit;
          cursor: pointer;
          box-sizing: border-box;
        }

        .input-group select:focus {
          outline: none;
          border-color: #127BB8;
          box-shadow: 0 0 0 3px rgba(18, 123, 184, 0.1);
        }

        .input-group select.error {
          border-color: #dc3545;
        }

        .input-group select.error:focus {
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

export default Select;

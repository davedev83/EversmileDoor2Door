/**
 * Toggle switch component
 */

import React from 'react';

const Toggle = ({ 
  checked = false, 
  onChange, 
  label,
  className = '',
  ...props 
}) => {
  return (
    <div className={`toggle-container ${className}`}>
      <span className="toggle-label">{label}</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          {...props}
        />
        <span className="toggle-slider">
          <span className="toggle-text"></span>
        </span>
      </label>

      <style jsx>{`
        .toggle-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .toggle-label {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 80px;
          height: 34px;
          cursor: pointer;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .toggle-text {
          position: absolute;
          font-size: 10px;
          font-weight: 600;
          color: white;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.4s ease;
          user-select: none;
          pointer-events: none;
          z-index: 1;
          right: 8px;
        }

        .toggle-text::after {
          content: "NO";
        }

        input:checked + .toggle-slider {
          background-color: #127BB8;
        }

        input:checked + .toggle-slider .toggle-text {
          left: 8px;
          right: auto;
        }

        input:checked + .toggle-slider .toggle-text::after {
          content: "YES";
        }

        input:focus + .toggle-slider {
          box-shadow: 0 0 1px #127BB8;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(46px);
        }
      `}</style>
    </div>
  );
};

export default Toggle;

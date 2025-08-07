/**
 * Progress bar component for multi-step forms
 */

import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className="progress-text">
        {currentStep} of {totalSteps}
      </span>
      
      <style jsx>{`
        .progress-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #127BB8, #0f6ba3);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 500;
          color: #666;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;

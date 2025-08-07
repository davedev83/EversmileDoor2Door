/**
 * Sample selector component with quantity controls
 */

import React, { useState } from 'react';
import { SAMPLE_CONFIG } from '../../utils/sampleUtils';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';

const SampleSelector = ({ 
  enabled = false, 
  onToggle, 
  quantities = {}, 
  onQuantityChange,
  otherSample = '',
  onOtherSampleChange,
  error
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleQuantityChange = (sampleId, delta) => {
    const currentQuantity = quantities[sampleId] || 0;
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    onQuantityChange?.(sampleId, newQuantity);
    
    // Show/hide other sample input based on "other" quantity
    if (sampleId === 'other') {
      setShowOtherInput(newQuantity > 0);
      if (newQuantity === 0) {
        onOtherSampleChange?.('');
      }
    }
  };

  return (
    <div className="sample-selector">
      <Toggle
        checked={enabled}
        onChange={onToggle}
        label="Did you provide samples?"
      />

      {enabled && (
        <div className="samples-list">
          {SAMPLE_CONFIG.map((sample) => (
            <div key={sample.id} className={`sample-item ${quantities[sample.id] > 0 ? 'has-quantity' : ''}`}>
              <div className="sample-info">
                <span className="sample-name">{sample.name}</span>
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="quantity-btn minus"
                    onClick={() => handleQuantityChange(sample.id, -1)}
                    disabled={!quantities[sample.id] || quantities[sample.id] === 0}
                  >
                    −
                  </button>
                  <span className="quantity">{quantities[sample.id] || 0}</span>
                  <button
                    type="button"
                    className="quantity-btn plus"
                    onClick={() => handleQuantityChange(sample.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(showOtherInput || quantities.other > 0) && (
            <div className="other-sample-input">
              <Input
                label="Specify other sample"
                value={otherSample}
                onChange={(e) => onOtherSampleChange?.(e.target.value)}
                placeholder="Enter sample name"
              />
            </div>
          )}
        </div>
      )}

      {error && <span className="error-message">{error}</span>}
      
      <style jsx>{`
        .sample-selector {
          margin-bottom: 25px;
        }

        .samples-list {
          margin-top: 20px;
        }

        .samples-list .sample-item {
          background:rgb(244, 244, 244) !important;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .samples-list .sample-item:last-child {
          margin-bottom: 0;
        }

        .samples-list .sample-item.has-quantity {
          border-color: #127BB8 !important;
          background-color: #C7E8FF !important;
          background: #C7E8FF !important;
        }

        .sample-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sample-name {
          font-weight: 500;
          color: #333;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quantity-btn {
          width: 36px;
          height: 36px;
          border: 2px solid #127BB8;
          background: white;
          color: #127BB8;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #127BB8;
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          min-width: 24px;
          text-align: center;
        }

        .other-sample-input {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
        }

        .error-message {
          display: block;
          color: #dc3545;
          font-size: 14px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default SampleSelector;

/**
 * Credit card form component
 */

import React, { useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import { formatCardNumber, formatCVV } from '../../utils/formUtils';

const CreditCardForm = ({ 
  enabled = false, 
  onToggle, 
  formData = {},
  onChange,
  errors = {}
}) => {
  // Generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 15; i++) {
      const year = currentYear + i;
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };

  // Generate month options
  const monthOptions = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' }
  ];

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Apply formatting for specific fields
    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cvv') {
      processedValue = formatCVV(value);
    }
    
    onChange?.(field, processedValue);
  };

  // Clear form data when disabled
  useEffect(() => {
    if (!enabled) {
      const fieldsToReset = ['cardName', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvv'];
      fieldsToReset.forEach(field => {
        onChange?.(field, '');
      });
    }
  }, [enabled, onChange]);

  return (
    <div className="credit-card-form">
      <Toggle
        checked={enabled}
        onChange={onToggle}
        label="Credit Card Information"
      />

      {enabled && (
        <div className="credit-card-fields">
          <Input
            label="Cardholder Name"
            value={formData.cardName || ''}
            onChange={(e) => handleInputChange('cardName', e.target.value)}
            error={errors.cardName}
            required
            placeholder="Enter cardholder name"
          />

          <Input
            label="Card Number"
            value={formData.cardNumber || ''}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            error={errors.cardNumber}
            required
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />

          <div className="expiry-row">
            <Select
              label="Expiry Month"
              value={formData.expiryMonth || ''}
              onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
              options={monthOptions}
              error={errors.expiryMonth}
              required
              placeholder="Month"
            />

            <Select
              label="Expiry Year"
              value={formData.expiryYear || ''}
              onChange={(e) => handleInputChange('expiryYear', e.target.value)}
              options={generateYearOptions()}
              error={errors.expiryYear}
              required
              placeholder="Year"
            />
          </div>

          <Input
            label="CVV"
            value={formData.cvv || ''}
            onChange={(e) => handleInputChange('cvv', e.target.value)}
            error={errors.cvv}
            required
            placeholder="123"
            maxLength={4}
          />
        </div>
      )}
      
      <style jsx>{`
        .credit-card-form {
          margin-bottom: 25px;
        }



        .credit-card-fields {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          border: 2px solid #e0e0e0;
        }

        .expiry-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 480px) {
          .expiry-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CreditCardForm;

/**
 * Survey form component for visit questionnaire
 */

import React, { useState } from 'react';
import { Toggle, Input, Textarea } from '../ui';

const SurveyForm = ({ 
  surveyData = {}, 
  onChange, 
  errors = {} 
}) => {
  const [showQuotedPricesInput, setShowQuotedPricesInput] = useState(
    surveyData.quotedPrices === true
  );
  const [showReadyToOrderInput, setShowReadyToOrderInput] = useState(
    surveyData.readyToOrder === true
  );

  const handleToggleChange = (field, value) => {
    onChange(field, value);
    
    // Show/hide conditional inputs
    if (field === 'quotedPrices') {
      setShowQuotedPricesInput(value);
      if (!value) {
        onChange('quotedPricesDetails', '');
      }
    }
    
    if (field === 'readyToOrder') {
      setShowReadyToOrderInput(value);
      if (!value) {
        onChange('readyToOrderDetails', '');
      }
    }
  };

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="survey-form">
      <div className="survey-section">
        <Toggle
          checked={surveyData.knewAboutProducts || false}
          onChange={(value) => handleToggleChange('knewAboutProducts', value)}
          label="Did they know about our products?"
        />

        <Toggle
          checked={surveyData.soldProductsBefore || false}
          onChange={(value) => handleToggleChange('soldProductsBefore', value)}
          label="Did they ever sell our products before?"
        />

        <Toggle
          checked={surveyData.interestedInAlignerFresh || false}
          onChange={(value) => handleToggleChange('interestedInAlignerFresh', value)}
          label="Are they interested in the AlignerFresh Foam?"
        />

        <Toggle
          checked={surveyData.gaveIPRGlideSample || false}
          onChange={(value) => handleToggleChange('gaveIPRGlideSample', value)}
          label="Did you give them an IPR Glide sample?"
        />

        <Toggle
          checked={surveyData.spokeToDoctor || false}
          onChange={(value) => handleToggleChange('spokeToDoctor', value)}
          label="Were you able to speak to the doctor?"
        />

        <Toggle
          checked={surveyData.showedSmartIPRVideo || false}
          onChange={(value) => handleToggleChange('showedSmartIPRVideo', value)}
          label="Did you show them our Smart IPR Video?"
        />

        <Toggle
          checked={surveyData.quotedPrices || false}
          onChange={(value) => handleToggleChange('quotedPrices', value)}
          label="Did you quote them any prices for any products?"
        />

        {showQuotedPricesInput && (
          <div className="conditional-input">
            <Input
              label="Price quote details"
              value={surveyData.quotedPricesDetails || ''}
              onChange={(e) => handleInputChange('quotedPricesDetails', e.target.value)}
              error={errors.quotedPricesDetails}
              placeholder="Enter details about the prices quoted"
            />
          </div>
        )}

        <Toggle
          checked={surveyData.readyToOrder || false}
          onChange={(value) => handleToggleChange('readyToOrder', value)}
          label="Are they ready to order any products?"
        />

        {showReadyToOrderInput && (
          <div className="conditional-input">
            <Input
              label="Order readiness details"
              value={surveyData.readyToOrderDetails || ''}
              onChange={(e) => handleInputChange('readyToOrderDetails', e.target.value)}
              error={errors.readyToOrderDetails}
              placeholder="Enter details about their order readiness"
            />
          </div>
        )}

        <Textarea
          label="How would you describe the office or staff?"
          value={surveyData.officeDescription || ''}
          onChange={(e) => handleInputChange('officeDescription', e.target.value)}
          error={errors.officeDescription}
          rows={4}
          placeholder="Describe the office environment, staff attitude, etc."
        />
      </div>

      <style jsx>{`
        .survey-form {
          padding: 0 20px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .survey-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 25px 20px;
          border: 2px solid #e0e0e0;
        }

        .conditional-input {
          margin-left: 20px;
          margin-top: 10px;
          margin-bottom: 15px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        :global(.survey-form .toggle-container) {
          margin-bottom: 20px;
          padding: 0;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        :global(.survey-form .toggle-label) {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          flex: 1;
          margin-right: 15px;
          line-height: 1.4;
        }

        :global(.survey-form .toggle-switch) {
          flex-shrink: 0;
          width: 80px;
          height: 34px;
        }

        :global(.survey-form .input-group) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default SurveyForm;

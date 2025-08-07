/**
 * Review section component for displaying form data summary
 */

import React from 'react';
import { formatDate } from '../../utils';

const ReviewSection = ({
  formData,
  selectedDate,
  sampleQuantities,
  toggleStates,
  otherSample,
  surveyData = {}
}) => {
  const getSamplesArray = () => {
    if (!toggleStates.sampleToggle) {
      return [];
    }

    const sampleConfig = [
      { id: 'alignerfresh-mint', name: 'AlignerFresh Mint' },
      { id: 'alignerfresh-flavors', name: 'AlignerFresh Flavors' },
      { id: 'allclean-minerals', name: 'AllClean Minerals' },
      { id: 'ipr-glide', name: 'IPR Glide' },
      { id: 'other', name: 'Other' }
    ];

    const samplesProvided = [];
    sampleConfig.forEach(sample => {
      const quantity = sampleQuantities[sample.id] || 0;
      if (quantity > 0) {
        samplesProvided.push({
          name: sample.name,
          quantity: quantity
        });
      }
    });

    return samplesProvided;
  };

  const formatCreditCard = () => {
    if (!toggleStates.creditCardToggle || !formData.cardNumber) {
      return 'Not provided';
    }
    return `**** **** **** ${formData.cardNumber.slice(-4)}`;
  };

  return (
    <div className="review-container">
      <div className="review-grid">
        <div className="review-item">
          <span className="review-label">Visit Date:</span>
          <span className="review-value">{formatDate(selectedDate)}</span>
        </div>

        <div className="review-item">
          <span className="review-label">Practice Name:</span>
          <span className="review-value">{formData.practiceName || 'Not provided'}</span>
        </div>

        <div className="review-item">
          <span className="review-label">Phone:</span>
          <span className="review-value">{formData.phone || 'Not provided'}</span>
        </div>

        <div className="review-item">
          <span className="review-label">Email:</span>
          <span className="review-value">{formData.email || 'Not provided'}</span>
        </div>

        <div className="review-item">
          <span className="review-label">Address:</span>
          <span className="review-value">{formData.address || 'Not provided'}</span>
        </div>

        <div className="review-item">
          <span className="review-label">Samples Provided:</span>
          <div className="review-value">
            {getSamplesArray().length === 0 ? (
              <span className="no-samples">None</span>
            ) : (
              <div className="samples-badges">
                {getSamplesArray().map((sample, index) => (
                  <span key={index} className="sample-badge">
                    {sample.name}: {sample.quantity}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {otherSample && (
          <div className="review-item">
            <span className="review-label">Other Sample:</span>
            <span className="review-value">{otherSample}</span>
          </div>
        )}

        <div className="review-item">
          <span className="review-label">Topics Discussed:</span>
          <span className="review-value">{formData.topicsDiscussed || 'Not provided'}</span>
        </div>

        {/* Survey Section */}
        <div className="review-section">
          <h3 className="section-title">Survey Responses</h3>

          <div className="review-item">
            <span className="review-label">Knew about products:</span>
            <span className="review-value">{surveyData.knewAboutProducts === null ? 'Not answered' : (surveyData.knewAboutProducts ? 'Yes' : 'No')}</span>
          </div>

          <div className="review-item">
            <span className="review-label">Sold products before:</span>
            <span className="review-value">{surveyData.soldProductsBefore === null ? 'Not answered' : (surveyData.soldProductsBefore ? 'Yes' : 'No')}</span>
          </div>

          <div className="review-item">
            <span className="review-label">Interested in AlignerFresh:</span>
            <span className="review-value">{surveyData.interestedInAlignerFresh === null ? 'Not answered' : (surveyData.interestedInAlignerFresh ? 'Yes' : 'No')}</span>
          </div>

          <div className="review-item">
            <span className="review-label">Gave IPR Glide sample:</span>
            <span className="review-value">{surveyData.gaveIPRGlideSample === null ? 'Not answered' : (surveyData.gaveIPRGlideSample ? 'Yes' : 'No')}</span>
          </div>

          <div className="review-item">
            <span className="review-label">Spoke to doctor:</span>
            <span className="review-value">{surveyData.spokeToDoctor === null ? 'Not answered' : (surveyData.spokeToDoctor ? 'Yes' : 'No')}</span>
          </div>

          <div className="review-item">
            <span className="review-label">Showed Smart IPR Video:</span>
            <span className="review-value">{surveyData.showedSmartIPRVideo === null ? 'Not answered' : (surveyData.showedSmartIPRVideo ? 'Yes' : 'No')}</span>
          </div>

          <div className="review-item">
            <span className="review-label">Quoted prices:</span>
            <span className="review-value">{surveyData.quotedPrices === null ? 'Not answered' : (surveyData.quotedPrices ? 'Yes' : 'No')}</span>
          </div>

          {surveyData.quotedPricesDetails && (
            <div className="review-item">
              <span className="review-label">Price quote details:</span>
              <span className="review-value">{surveyData.quotedPricesDetails}</span>
            </div>
          )}

          <div className="review-item">
            <span className="review-label">Ready to order:</span>
            <span className="review-value">{surveyData.readyToOrder === null ? 'Not answered' : (surveyData.readyToOrder ? 'Yes' : 'No')}</span>
          </div>

          {surveyData.readyToOrderDetails && (
            <div className="review-item">
              <span className="review-label">Order readiness details:</span>
              <span className="review-value">{surveyData.readyToOrderDetails}</span>
            </div>
          )}

          {surveyData.officeDescription && (
            <div className="review-item">
              <span className="review-label">Office description:</span>
              <span className="review-value">{surveyData.officeDescription}</span>
            </div>
          )}
        </div>

        <div className="review-item">
          <span className="review-label">Credit Card:</span>
          <span className="review-value">{formatCreditCard()}</span>
        </div>
      </div>

      <style jsx>{`
        .review-container {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .review-grid {
          display: grid;
          gap: 20px;
        }

        .review-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          margin: 16px 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .review-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid #e9ecef;
          gap: 16px;
        }

        .review-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .review-label {
          font-weight: 600;
          color: #495057;
          font-size: 15px;
          min-width: 120px;
          flex-shrink: 0;
        }

        .review-value {
          color: #212529;
          font-size: 15px;
          font-weight: 400;
          text-align: right;
          word-wrap: break-word;
          line-height: 1.5;
          flex: 1;
        }

        .samples-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }

        .sample-badge {
          background: linear-gradient(135deg, #127BB8, #0f6ba3);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(18, 123, 184, 0.2);
        }

        .no-samples {
          color: #6c757d;
          font-style: italic;
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
          .review-container {
            padding: 20px;
            border-radius: 12px;
          }

          .review-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 12px 0;
          }

          .review-label {
            min-width: auto;
            font-size: 14px;
          }

          .review-value {
            text-align: left;
            font-size: 14px;
          }

          .samples-badges {
            justify-content: flex-start;
          }

          .sample-badge {
            font-size: 12px;
            padding: 5px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewSection;

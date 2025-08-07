/**
 * Multi-step form component for visit data entry
 */

import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  ProgressBar,
  Button,
  Input,
  Textarea,
  Select
} from '../';
import DatePickerField from './DatePickerField';
import SampleSelector from './SampleSelector';
import SurveyForm from './SurveyForm';
import CreditCardForm from './CreditCardForm';
import ReviewSection from './ReviewSection';
import {
  useMultiStepForm,
  useFormValidation,
  useSwipeGestures
} from '../../hooks';
import {
  formatDateForAPI,
  parseDate,
  setTimeToNoon,
  FORM_STEPS
} from '../../utils';
import { saveVisit } from '../../services';

const MultiStepForm = ({ 
  existingData = null, 
  onBack, 
  onSuccess 
}) => {
  const isEditing = !!existingData;
  const originalStatus = existingData?.status || null;

  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    isFirstStep,
    isLastStep
  } = useMultiStepForm();

  const {
    errors,
    validateStep,
    clearErrors
  } = useFormValidation();

  const [selectedDate, setSelectedDate] = useState(() => setTimeToNoon(new Date()));
  const [sampleQuantities, setSampleQuantities] = useState({});
  const [toggleStates, setToggleStates] = useState({
    sampleToggle: false,
    creditCardToggle: false
  });
  const [otherSample, setOtherSample] = useState('');
  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // Track visit ID to prevent duplicate creation during auto-save
  const [currentVisitId, setCurrentVisitId] = useState(null);
  const [formSessionKey] = useState(() => `visitForm_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);

  // Setup swipe gestures
  useSwipeGestures(
    () => handleNext(), // swipe left = next
    () => handlePrev()  // swipe right = prev
  );

  // Initialize form with existing data
  useEffect(() => {
    if (existingData) {
      populateExistingData();
      // When editing existing data, we don't have unsaved changes initially
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date(existingData.updatedAt || existingData.createdAt || new Date()));
      setCurrentVisitId(existingData._id);
    } else {
      // For new forms, check if there's a visit ID in localStorage
      const storedVisitId = localStorage.getItem(formSessionKey);
      if (storedVisitId) {
        setCurrentVisitId(storedVisitId);
      }
    }
  }, [existingData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear localStorage when component unmounts or when successfully saving
  useEffect(() => {
    return () => {
      // Only clear if we're not editing an existing visit
      if (!existingData) {
        localStorage.removeItem(formSessionKey);
      }
    };
  }, [existingData]);



  // Setup beforeunload warning for unsaved changes and cleanup
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }

      // Clean up localStorage on page unload if not editing existing visit
      if (!isEditing && currentVisitId) {
        localStorage.removeItem(formSessionKey);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isEditing, currentVisitId, formSessionKey]);

  const populateExistingData = () => {
    // Set date
    if (existingData.visitDate) {
      setSelectedDate(parseDate(existingData.visitDate));
    }

    // Set form data
    updateFormData({
      practiceName: existingData.practiceName || '',
      drName: existingData.drName || '',
      phone: existingData.phone || '',
      email: existingData.email || '',
      address: existingData.address || '',
      frontDeskName: existingData.frontDeskName || '',
      backOfficeAssistantName: existingData.backOfficeAssistantName || '',
      officeManagerName: existingData.officeManagerName || '',
      topicsDiscussed: existingData.topicsDiscussed || '',
      cardName: existingData.creditCard?.name || '',
      cardNumber: existingData.creditCard?.number || '',
      expiryMonth: existingData.creditCard?.expiryMonth || '',
      expiryYear: existingData.creditCard?.expiryYear || '',
      cvv: existingData.creditCard?.cvv || ''
    });

    // Set samples
    if (existingData.samplesProvided && existingData.samplesProvided.length > 0) {
      setToggleStates(prev => ({ ...prev, sampleToggle: true }));
      
      const quantities = {};
      existingData.samplesProvided.forEach(sample => {
        const sampleId = getSampleId(sample.name);
        quantities[sampleId] = sample.quantity;
      });
      setSampleQuantities(quantities);
    }

    // Set other sample
    if (existingData.otherSample) {
      setOtherSample(existingData.otherSample);
    }

    // Set credit card
    if (existingData.creditCard && existingData.creditCard.number) {
      setToggleStates(prev => ({ ...prev, creditCardToggle: true }));
    }

    // Set survey data
    if (existingData.survey) {
      setSurveyData(existingData.survey);
    }
  };

  const getSampleId = (sampleName) => {
    const mapping = {
      'AlignerFresh Mint': 'alignerfresh-mint',
      'AlignerFresh Flavors': 'alignerfresh-flavors',
      'AllClean Minerals': 'allclean-minerals',
      'IPR Glide': 'ipr-glide',
      'Other': 'other'
    };
    return mapping[sampleName] || sampleName.toLowerCase().replace(/\s+/g, '-');
  };

  const formatSaveTime = (saveTime) => {
    const now = new Date();
    const diffMs = now - saveTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    return saveTime.toLocaleDateString();
  };

  // Check if we have minimum required data to save a visit
  const hasMinimumRequiredData = () => {
    // Must have practice name and at least one contact field
    const hasPracticeName = formData.practiceName && formData.practiceName.trim().length > 0;
    const hasContactInfo = (formData.phone && formData.phone.trim().length > 0) ||
                          (formData.email && formData.email.trim().length > 0);

    return hasPracticeName && hasContactInfo;
  };

  // Centralized function to mark unsaved changes with proper safeguards
  const markUnsavedChanges = () => {
    // Never mark unsaved changes on Visit Date step (no important data to save)
    if (currentStep === FORM_STEPS.VISIT_DATE) {
      return;
    }

    // Only mark as having unsaved changes if we're editing or on practice info step or later
    if (isEditing || currentStep >= FORM_STEPS.PRACTICE_INFO) {
      setHasUnsavedChanges(true);
    }
  };

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
    markUnsavedChanges();
    clearErrors();
  };

  const handleSampleQuantityChange = (sampleId, quantity) => {
    setSampleQuantities(prev => ({
      ...prev,
      [sampleId]: quantity
    }));
    markUnsavedChanges();
  };

  const handleToggleChange = (toggleName, value) => {
    setToggleStates(prev => ({
      ...prev,
      [toggleName]: value
    }));
    markUnsavedChanges();
  };

  const handleSurveyChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
    markUnsavedChanges();
    clearErrors();
  };

  const validateCurrentStep = () => {
    return validateStep(currentStep, {
      ...formData,
      visitDate: selectedDate,
      survey: surveyData
    }, sampleQuantities, toggleStates);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      handleSubmit();
      return;
    }

    // Save draft when leaving a step that has important data (Practice Info or later)
    // and we have minimum required data
    const shouldSave = currentStep >= FORM_STEPS.PRACTICE_INFO &&
                      !isSaving &&
                      (isEditing || hasMinimumRequiredData());

    // Move to next step first
    nextStep();

    // Save after moving to next step if needed
    if (shouldSave) {
      // Add a small delay to prevent rapid saves when users click quickly
      setTimeout(() => {
        if (!isSaving) {
          saveDraft();
        }
      }, 300);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      prevStep();
    }
  };

  const collectFormData = () => {
    const data = {
      visitDate: formatDateForAPI(selectedDate),
      ...formData
    };

    // Add samples
    data.samplesProvided = [];
    if (toggleStates.sampleToggle) {
      const sampleConfig = [
        { id: 'alignerfresh-mint', name: 'AlignerFresh Mint' },
        { id: 'alignerfresh-flavors', name: 'AlignerFresh Flavors' },
        { id: 'allclean-minerals', name: 'AllClean Minerals' },
        { id: 'ipr-glide', name: 'IPR Glide' },
        { id: 'other', name: 'Other' }
      ];

      sampleConfig.forEach(sample => {
        const quantity = sampleQuantities[sample.id] || 0;
        if (quantity > 0) {
          data.samplesProvided.push({
            name: sample.name,
            quantity: quantity
          });
        }
      });
    }

    // Add other sample
    if (otherSample) {
      data.otherSample = otherSample;
    }

    // Add survey data
    data.survey = surveyData;

    // Add credit card
    if (toggleStates.creditCardToggle) {
      data.creditCard = {
        number: data.cardNumber,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
        name: data.cardName
      };
    } else {
      data.creditCard = null;
    }

    // Clean up individual credit card fields
    delete data.cardNumber;
    delete data.expiryMonth;
    delete data.expiryYear;
    delete data.cvv;
    delete data.cardName;

    return data;
  };

  const saveDraft = async (isAutoSave = false) => {
    // Prevent concurrent saves
    if (isSaving) {
      console.log('Save already in progress, skipping...');
      return;
    }

    // Don't save if we don't have minimum required data (unless editing existing visit)
    if (!isEditing && !hasMinimumRequiredData()) {
      console.log('Insufficient data for saving, skipping auto-save...');
      return;
    }

    try {
      setIsSaving(true);
      const data = collectFormData();
      data.status = 'draft';

      // Set the visit ID if we have one
      if (isEditing) {
        data._id = existingData._id;
      } else if (currentVisitId) {
        data._id = currentVisitId;
      }

      const result = await saveVisit(data);

      // If this was a new visit creation, store the visit ID
      if (!currentVisitId && result.visitId) {
        setCurrentVisitId(result.visitId);
        localStorage.setItem(formSessionKey, result.visitId);
      }

      // Update state
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date());

      // Show success message
      const message = isAutoSave ? '✓ Auto-saved' : '✓ Draft saved';
      setSubmitStatus(message);
      setTimeout(() => setSubmitStatus(''), isAutoSave ? 2000 : 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      // Don't block the user if draft save fails, but show error for manual saves
      if (!isAutoSave) {
        const errorMessage = error.message || 'Failed to save draft';
        setSubmitStatus(`❌ ${errorMessage}`);
        setTimeout(() => setSubmitStatus(''), 5000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let actionText;
      if (isEditing && originalStatus === 'saved') {
        actionText = 'Updating visit data...';
      } else {
        actionText = 'Saving visit data...';
      }
      setSubmitStatus(actionText);

      const data = collectFormData();
      data.status = 'saved';

      // Set the visit ID if we have one
      if (isEditing) {
        data._id = existingData._id;
        data.isRealUpdate = originalStatus === 'saved';
      } else if (currentVisitId) {
        data._id = currentVisitId;
      }

      const result = await saveVisit(data);

      if (result.success) {
        // Clear localStorage since we successfully saved
        if (!isEditing) {
          localStorage.removeItem(formSessionKey);
          setCurrentVisitId(null);
        }

        // Clear unsaved changes since we successfully saved
        setHasUnsavedChanges(false);
        setLastSaveTime(new Date());

        let successText;
        if (isEditing && originalStatus === 'saved') {
          successText = '✅ Visit updated successfully!';
        } else {
          successText = '✅ Visit saved successfully!';
        }
        setSubmitStatus(successText);

        // Go back to list after 2 seconds
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save visit data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    // Clear localStorage when user navigates back (cancels the form)
    if (!isEditing && currentVisitId) {
      localStorage.removeItem(formSessionKey);
      setCurrentVisitId(null);
    }
    onBack?.();
  };

  return (
    <div className="multistep-form">
      <Breadcrumb onBackClick={handleBackClick}>
        {submitStatus && (
          <div className="draft-indicator" style={{ display: 'block' }}>
            {submitStatus}
          </div>
        )}
        {!submitStatus && lastSaveTime && (
          <div className="save-status" style={{ display: 'block' }}>
            {hasUnsavedChanges ? '● Unsaved changes' : `✓ Saved ${formatSaveTime(lastSaveTime)}`}
          </div>
        )}
      </Breadcrumb>

      <div className="form-header" style={{ padding: '15px 20px 10px 20px' }}>
        <ProgressBar currentStep={currentStep} totalSteps={7} />
      </div>

      <div className="form-container">
        {/* Step 1: Visit Date */}
        {currentStep === FORM_STEPS.VISIT_DATE && (
          <div className="form-step active visit-date-step">
            <div className="visit-date-content">
              <h2 className="step-title">Visit Date</h2>
              <DatePickerField
                selectedDate={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  // Don't mark unsaved changes for date picker - no important data to save
                }}
                error={errors.visitDate}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Practice Information */}
        {currentStep === FORM_STEPS.PRACTICE_INFO && (
          <div className="form-step active">
            <h2 className="step-title">Practice Information</h2>
            <Input
              label="Practice Name"
              value={formData.practiceName || ''}
              onChange={(e) => handleInputChange('practiceName', e.target.value)}
              error={errors.practiceName}
              required
              placeholder="Enter practice name"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              required
              placeholder="Enter phone number"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              placeholder="Enter email address"
            />
            <Input
              label="Address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              required
              placeholder="Enter practice address"
            />
            <h2 className="step-title">Additional Information</h2>
            <Input
              label="Dr. Name"
              value={formData.drName || ''}
              onChange={(e) => handleInputChange('drName', e.target.value)}
              error={errors.drName}
              placeholder="Enter doctor's name"
            />
            <Input
              label="Front Desk Name"
              value={formData.frontDeskName || ''}
              onChange={(e) => handleInputChange('frontDeskName', e.target.value)}
              error={errors.frontDeskName}
              placeholder="Enter front desk staff name"
            />
            <Input
              label="Back Office Assistant Name"
              value={formData.backOfficeAssistantName || ''}
              onChange={(e) => handleInputChange('backOfficeAssistantName', e.target.value)}
              error={errors.backOfficeAssistantName}
              placeholder="Enter back office assistant name"
            />
            <Input
              label="Office Manager Name"
              value={formData.officeManagerName || ''}
              onChange={(e) => handleInputChange('officeManagerName', e.target.value)}
              error={errors.officeManagerName}
              placeholder="Enter office manager name"
            />
          </div>
        )}

        {/* Step 3: Samples Provided */}
        {currentStep === FORM_STEPS.SAMPLES && (
          <div className="form-step active">
            <h2 className="step-title">Samples Provided</h2>
            <SampleSelector
              enabled={toggleStates.sampleToggle}
              onToggle={(enabled) => handleToggleChange('sampleToggle', enabled)}
              quantities={sampleQuantities}
              onQuantityChange={handleSampleQuantityChange}
              otherSample={otherSample}
              onOtherSampleChange={(value) => {
                setOtherSample(value);
                markUnsavedChanges();
              }}
              error={errors.samples}
            />
          </div>
        )}

        {/* Step 4: Topics and Notes */}
        {currentStep === FORM_STEPS.TOPICS && (
          <div className="form-step active">
            <h2 className="step-title">Topics & Notes</h2>
            <Textarea
              label="Topics discussed and notes"
              value={formData.topicsDiscussed || ''}
              onChange={(e) => handleInputChange('topicsDiscussed', e.target.value)}
              error={errors.topicsDiscussed}
              rows={6}
              placeholder="Enter topics discussed, key points, follow-up actions, etc."
            />
          </div>
        )}

        {/* Step 5: Survey */}
        {currentStep === FORM_STEPS.SURVEY && (
          <div className="form-step active">
            <h2 className="step-title">Survey</h2>
            <SurveyForm
              surveyData={surveyData}
              onChange={handleSurveyChange}
              errors={errors}
            />
          </div>
        )}

        {/* Step 6: Credit Card Information */}
        {currentStep === FORM_STEPS.CREDIT_CARD && (
          <div className="form-step active">
            <h2 className="step-title">Credit Card Information</h2>
            <CreditCardForm
              enabled={toggleStates.creditCardToggle}
              onToggle={(enabled) => handleToggleChange('creditCardToggle', enabled)}
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          </div>
        )}

        {/* Step 7: Review and Submit */}
        {currentStep === FORM_STEPS.REVIEW && (
          <div className="form-step active">
            <h2 className="step-title">Review & Submit</h2>
            <ReviewSection
              formData={formData}
              selectedDate={selectedDate}
              sampleQuantities={sampleQuantities}
              toggleStates={toggleStates}
              otherSample={otherSample}
              surveyData={surveyData}
            />
            {submitStatus && (
              <div className="submit-status" style={{ marginTop: '20px' }}>
                {submitStatus}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="navigation-container">
        <Button
          onClick={handlePrev}
          disabled={isFirstStep}
          variant="secondary"
          className="nav-button prev-button"
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={loading}
          className="nav-button next-button"
        >
          {isLastStep ? (isEditing && originalStatus === 'saved' ? 'Update' : 'Save') : 'Next'}
        </Button>
      </div>

      <style jsx>{`
        .form-step {
          flex: 1;
          display: none;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 0;
        }

        .form-step.active {
          display: flex;
        }

        .step-title {
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 10px 0 15px 0;
          padding: 0 20px;
          flex-shrink: 0;
        }
        .multistep-form {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
          overflow: hidden;
        }

        .form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding-top: 0;
          padding-bottom: 0;
        }

        .visit-date-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          min-height: 100%;
        }

        .visit-date-content {
          display: flex;
          flex-direction: column;
          padding-bottom: 20px;
          min-height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .visit-date-step .step-title {
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 10px 0 15px 0;
          padding: 0 20px;
          flex-shrink: 0;
        }

        .navigation-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 20px;
          background: white;
          border-top: 1px solid #e0e0e0;
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          z-index: 10;
        }

        :global(.nav-button) {
          flex: 1;
          padding: 16px 24px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          min-height: 56px !important;
        }



        :global(.prev-button) {
          background: #f8f9fa !important;
          color: #666 !important;
          border: 2px solid #e0e0e0 !important;
        }

        :global(.prev-button:hover:not(:disabled)) {
          background: #e9ecef !important;
          border-color: #127BB8 !important;
          color: #127BB8 !important;
        }

        :global(.prev-button:disabled) {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        :global(.next-button) {
          background: linear-gradient(135deg, #127BB8, #0f6ba3) !important;
          color: white !important;
          border: none !important;
        }

        :global(.next-button:hover:not(:disabled)) {
          background: linear-gradient(135deg, #0f6ba3, #0d5a8a) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(18, 123, 184, 0.3) !important;
        }

        .save-status {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          color: #666;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Mobile-specific improvements for scrolling */
        @media (max-width: 480px) {
          .visit-date-step {
            min-height: 100%;
          }

          .visit-date-content {
            min-height: 100%;
            padding-bottom: 40px;
          }

          .form-container {
            min-height: 100%;
          }
        }

        /* Ensure proper touch scrolling on iOS */
        @supports (-webkit-overflow-scrolling: touch) {
          .visit-date-step,
          .visit-date-content,
          .form-container {
            -webkit-overflow-scrolling: touch;
          }
        }

      `}</style>
    </div>
  );
};

export default MultiStepForm;

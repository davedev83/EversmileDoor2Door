/**
 * Custom hook for form validation
 */

import { useState, useCallback } from 'react';
import { 
  validateRequired, 
  validateEmail, 
  validatePhone,
  validateCardNumber,
  validateCVV,
  validateExpiryMonth,
  validateExpiryYear
} from '../utils/formUtils';
import { getAllSampleIds } from '../utils/sampleUtils';
import { FORM_STEPS } from '../utils/constants';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  /**
   * Validates a single field
   */
  const validateField = useCallback((fieldName, value, fieldType = 'text') => {
    let isValid = true;
    let errorMessage = '';

    switch (fieldType) {
      case 'required':
        isValid = validateRequired(value);
        errorMessage = isValid ? '' : 'This field is required';
        break;
      case 'email':
        isValid = validateRequired(value) && validateEmail(value);
        errorMessage = isValid ? '' : 'Please enter a valid email address';
        break;
      case 'phone':
        isValid = validateRequired(value) && validatePhone(value);
        errorMessage = isValid ? '' : 'Please enter a valid phone number';
        break;
      case 'cardNumber':
        isValid = validateCardNumber(value);
        errorMessage = isValid ? '' : 'Please enter a valid credit card number';
        break;
      case 'cvv':
        isValid = validateCVV(value);
        errorMessage = isValid ? '' : 'Please enter a valid CVV';
        break;
      case 'expiryMonth':
        isValid = validateExpiryMonth(value);
        errorMessage = isValid ? '' : 'Please select a valid month';
        break;
      case 'expiryYear':
        isValid = validateExpiryYear(value);
        errorMessage = isValid ? '' : 'Please select a valid year';
        break;
      default:
        isValid = true;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));

    return isValid;
  }, []);

  /**
   * Validates a specific form step
   */
  const validateStep = useCallback((step, formData, sampleQuantities = {}, toggleStates = {}) => {
    let isValid = true;
    const stepErrors = {};

    switch (step) {
      case FORM_STEPS.VISIT_DATE:
        if (!formData.visitDate) {
          stepErrors.visitDate = 'Visit date is required';
          isValid = false;
        }
        break;

      case FORM_STEPS.PRACTICE_INFO:
        if (!validateRequired(formData.practiceName)) {
          stepErrors.practiceName = 'Practice name is required';
          isValid = false;
        }
        if (!validateRequired(formData.phone) || !validatePhone(formData.phone)) {
          stepErrors.phone = 'Valid phone number is required';
          isValid = false;
        }
        if (!validateRequired(formData.email) || !validateEmail(formData.email)) {
          stepErrors.email = 'Valid email address is required';
          isValid = false;
        }
        if (!validateRequired(formData.address)) {
          stepErrors.address = 'Address is required';
          isValid = false;
        }
        break;

      case FORM_STEPS.SAMPLES:
        if (toggleStates.sampleToggle) {
          // If samples are enabled, check if any sample has quantity > 0
          const sampleIds = getAllSampleIds();
          const hasSamples = sampleIds.some(id => 
            sampleQuantities[id] && parseInt(sampleQuantities[id]) > 0
          );
          
          if (!hasSamples) {
            stepErrors.samples = 'Please select at least one sample or disable samples';
            isValid = false;
          }
        }
        break;

      case FORM_STEPS.TOPICS:
        // Topics are not required for drafts, always valid for navigation
        isValid = true;
        break;

      case FORM_STEPS.SURVEY:
        // Survey is optional, always valid for navigation
        isValid = true;
        break;

      case FORM_STEPS.CREDIT_CARD:
        if (toggleStates.creditCardToggle) {
          if (!validateRequired(formData.cardName)) {
            stepErrors.cardName = 'Cardholder name is required';
            isValid = false;
          }
          if (!validateCardNumber(formData.cardNumber)) {
            stepErrors.cardNumber = 'Valid credit card number is required';
            isValid = false;
          }
          if (!validateExpiryMonth(formData.expiryMonth)) {
            stepErrors.expiryMonth = 'Valid expiry month is required';
            isValid = false;
          }
          if (!validateExpiryYear(formData.expiryYear)) {
            stepErrors.expiryYear = 'Valid expiry year is required';
            isValid = false;
          }
          if (!validateCVV(formData.cvv)) {
            stepErrors.cvv = 'Valid CVV is required';
            isValid = false;
          }
        }
        break;

      case FORM_STEPS.REVIEW:
        // Review step is always valid
        isValid = true;
        break;

      default:
        isValid = true;
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return isValid;
  }, []);

  /**
   * Clears all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clears error for a specific field
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Gets error message for a field
   */
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || '';
  }, [errors]);

  /**
   * Checks if a field has an error
   */
  const hasFieldError = useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  return {
    errors,
    validateField,
    validateStep,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError
  };
};

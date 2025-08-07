/**
 * Custom hook for managing multi-step form state and navigation
 */

import { useState, useCallback } from 'react';
import { TOTAL_STEPS, FORM_STEPS } from '../utils/constants';

export const useMultiStepForm = (initialStep = 1) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({});

  /**
   * Goes to the next step
   */
  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  /**
   * Goes to the previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  /**
   * Goes to a specific step
   */
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  /**
   * Updates form data
   */
  const updateFormData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  /**
   * Resets the form to initial state
   */
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
  }, []);

  /**
   * Gets progress percentage
   */
  const getProgress = useCallback(() => {
    return (currentStep / TOTAL_STEPS) * 100;
  }, [currentStep]);

  /**
   * Checks if current step is the first step
   */
  const isFirstStep = currentStep === 1;

  /**
   * Checks if current step is the last step
   */
  const isLastStep = currentStep === TOTAL_STEPS;

  /**
   * Checks if current step is the review step
   */
  const isReviewStep = currentStep === FORM_STEPS.REVIEW;

  return {
    currentStep,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    resetForm,
    getProgress,
    isFirstStep,
    isLastStep,
    isReviewStep,
    totalSteps: TOTAL_STEPS
  };
};

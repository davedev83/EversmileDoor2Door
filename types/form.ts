/**
 * Type definitions for form-related data structures
 */

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRule {
  required?: boolean;
  type?: 'email' | 'phone' | 'cardNumber' | 'cvv' | 'expiryMonth' | 'expiryYear';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SampleQuantities {
  [sampleId: string]: number;
}

export interface ToggleStates {
  sampleToggle?: boolean;
  creditCardToggle?: boolean;
}

export interface FormStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}

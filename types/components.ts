/**
 * Type definitions for component props
 */

import { ReactNode } from 'react';
import { Visit, VisitFormData } from './visit';
import { FormErrors } from './form';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  type?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
}

export interface TextareaProps {
  label?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface VisitCardProps {
  visit: Visit;
  isAdminMode?: boolean;
  onEdit?: (visit: Visit) => void;
  onDelete?: (visitId: string, practiceName: string) => void;
}

export interface VisitListProps {
  visits: Visit[];
  loading?: boolean;
  isAdminMode?: boolean;
  currentPage?: number;
  totalPages?: number;
  onEditVisit?: (visit: Visit) => void;
  onDeleteVisit?: (visitId: string, practiceName: string) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface HeaderProps {
  isAdminMode?: boolean;
  children?: ReactNode;
  onLogoClick?: () => void;
}

export interface AppContainerProps {
  children: ReactNode;
}

export interface BreadcrumbProps {
  onBackClick: () => void;
  children?: ReactNode;
}

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface DatePickerFieldProps {
  label?: string;
  selectedDate?: Date;
  onChange?: (date: Date) => void;
  error?: string;
  required?: boolean;
}

export interface SampleSelectorProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  quantities?: { [key: string]: number };
  onQuantityChange?: (sampleId: string, quantity: number) => void;
  otherSample?: string;
  onOtherSampleChange?: (value: string) => void;
  error?: string;
}

export interface CreditCardFormProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  formData?: VisitFormData;
  onChange?: (field: string, value: string) => void;
  errors?: FormErrors;
}

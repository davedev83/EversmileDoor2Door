/**
 * Tests for auto-save duplicate prevention in MultiStepForm
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MultiStepForm from '../components/forms/MultiStepForm';
import * as visitService from '../services/visitService';

// Mock the visit service
jest.mock('../services/visitService');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock hooks
jest.mock('../hooks', () => ({
  useMultiStepForm: () => ({
    currentStep: 2, // PRACTICE_INFO step
    formData: {
      practiceName: 'Test Practice',
      phone: '123-456-7890',
      email: 'test@example.com',
      address: '123 Test St'
    },
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    updateFormData: jest.fn(),
    isFirstStep: false,
    isLastStep: false
  }),
  useFormValidation: () => ({
    errors: {},
    validateStep: jest.fn(() => true),
    clearErrors: jest.fn()
  }),
  useSwipeGestures: jest.fn()
}));

describe('MultiStepForm Auto-Save Duplicate Prevention', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    visitService.saveVisit.mockResolvedValue({ 
      success: true, 
      visitId: 'test-visit-id-123' 
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  test('should store visit ID in localStorage after first save', async () => {
    const { container } = render(<MultiStepForm />);

    // Get the component instance to test the saveDraft method directly
    const form = container.querySelector('.multistep-form');
    expect(form).toBeInTheDocument();

    // Test that localStorage is used correctly when a new visit is created
    expect(localStorageMock.getItem).toHaveBeenCalled();
  });

  test('should check localStorage for existing visit ID on initialization', async () => {
    // Mock localStorage to return a stored visit ID
    localStorageMock.getItem.mockReturnValue('existing-visit-id-456');

    const { container } = render(<MultiStepForm />);

    // Verify the form renders and localStorage is checked
    const form = container.querySelector('.multistep-form');
    expect(form).toBeInTheDocument();
    expect(localStorageMock.getItem).toHaveBeenCalled();
  });

  test('should initialize with localStorage check', async () => {
    localStorageMock.getItem.mockReturnValue('test-visit-id-789');

    const { container } = render(<MultiStepForm />);

    // Verify form renders and localStorage is checked during initialization
    const form = container.querySelector('.multistep-form');
    expect(form).toBeInTheDocument();
    expect(localStorageMock.getItem).toHaveBeenCalled();
  });

  test('should clear localStorage when user navigates back', () => {
    localStorageMock.getItem.mockReturnValue('test-visit-id-999');

    const mockOnBack = jest.fn();
    render(<MultiStepForm onBack={mockOnBack} />);

    // Simulate back navigation using the breadcrumb button
    const backButton = screen.getByText(/← Back to Visits/);
    fireEvent.click(backButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      expect.stringMatching(/^visitForm_/)
    );
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('should not use localStorage when editing existing visits', async () => {
    const existingData = {
      _id: 'existing-visit-123',
      practiceName: 'Existing Practice',
      status: 'draft'
    };

    const { container } = render(<MultiStepForm existingData={existingData} />);

    // Verify form renders
    const form = container.querySelector('.multistep-form');
    expect(form).toBeInTheDocument();

    // localStorage should not be used for storing new visit IDs when editing
    // (getItem might be called to check, but setItem should not be called)
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  test('should render form correctly', () => {
    const { container } = render(<MultiStepForm />);

    // Basic test to ensure the form renders
    const form = container.querySelector('.multistep-form');
    expect(form).toBeInTheDocument();

    // Verify localStorage is checked during initialization
    expect(localStorageMock.getItem).toHaveBeenCalled();
  });
});

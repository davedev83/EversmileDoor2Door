/**
 * DatePickerField component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatePickerField from '../components/forms/DatePickerField';

describe('DatePickerField', () => {
  test('renders date input field', () => {
    const mockOnChange = jest.fn();
    const testDate = new Date('2025-08-05');

    render(
      <DatePickerField
        selectedDate={testDate}
        onChange={mockOnChange}
      />
    );

    // Check if the input field is rendered with the formatted date
    const input = screen.getByDisplayValue(/08\/0[45]\/2025/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('date-display-input');
  });

  test('displays placeholder when no date is selected', () => {
    const mockOnChange = jest.fn();
    
    render(
      <DatePickerField
        selectedDate={null}
        onChange={mockOnChange}
      />
    );

    // Check if placeholder is shown
    const input = screen.getByPlaceholderText('MM/DD/YYYY');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('shows error state when error prop is provided', () => {
    const mockOnChange = jest.fn();
    const errorMessage = 'Date is required';
    
    render(
      <DatePickerField
        selectedDate={null}
        onChange={mockOnChange}
        error={errorMessage}
      />
    );

    // Check if error message is displayed
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('error-message');

    // Check if input has error class
    const input = screen.getByPlaceholderText('MM/DD/YYYY');
    expect(input).toHaveClass('error');
  });

  test('renders calendar icon', () => {
    const mockOnChange = jest.fn();
    
    render(
      <DatePickerField
        selectedDate={new Date()}
        onChange={mockOnChange}
      />
    );

    // Check if calendar icon is rendered
    const calendarIcon = document.querySelector('.calendar-icon svg');
    expect(calendarIcon).toBeInTheDocument();
  });

  test('renders inline calendar', () => {
    const mockOnChange = jest.fn();
    
    render(
      <DatePickerField
        selectedDate={new Date()}
        onChange={mockOnChange}
      />
    );

    // Check if calendar container is rendered
    const calendarContainer = document.querySelector('.calendar-container');
    expect(calendarContainer).toBeInTheDocument();
  });
});

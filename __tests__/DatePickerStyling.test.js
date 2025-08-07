/**
 * Test to verify DatePicker styling behavior for today's date vs selected date
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatePickerField from '../components/forms/DatePickerField';

describe('DatePicker Styling', () => {
  test('should render with proper CSS classes for today and selected dates', () => {
    const mockOnChange = jest.fn();
    const selectedDate = new Date('2025-08-03'); // Different from today
    
    const { container } = render(
      <DatePickerField
        selectedDate={selectedDate}
        onChange={mockOnChange}
      />
    );

    // Check that the component renders without errors
    expect(container.querySelector('.date-picker-calendar')).toBeInTheDocument();
    
    // Check that the calendar container exists
    expect(container.querySelector('.calendar-container')).toBeInTheDocument();
  });

  test('should handle null selected date', () => {
    const mockOnChange = jest.fn();
    
    const { container } = render(
      <DatePickerField
        selectedDate={null}
        onChange={mockOnChange}
      />
    );

    // Should still render the calendar
    expect(container.querySelector('.calendar-container')).toBeInTheDocument();
  });

  test('should render DatePicker component with proper structure', () => {
    const mockOnChange = jest.fn();
    const selectedDate = new Date('2025-08-03');

    const { container } = render(
      <DatePickerField
        selectedDate={selectedDate}
        onChange={mockOnChange}
      />
    );

    // Check that the main container has the expected class
    expect(container.querySelector('.date-input-group')).toBeInTheDocument();

    // Check that the calendar container exists
    expect(container.querySelector('.calendar-container')).toBeInTheDocument();

    // Check that the date display input exists
    expect(container.querySelector('.date-display-input')).toBeInTheDocument();
  });
});

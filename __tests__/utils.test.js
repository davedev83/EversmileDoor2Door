/**
 * Basic tests for utility functions
 */

const { formatDate, formatDateForAPI, validateEmail, validatePhone } = require('../utils');

describe('Date Utils', () => {
  test('formatDate should format date correctly', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date);
    expect(formatted).toBeTruthy();
  });

  test('formatDateForAPI should return YYYY-MM-DD format', () => {
    const date = new Date('2024-01-15T12:00:00');
    const formatted = formatDateForAPI(date);
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(formatted).toBe('2024-01-15');
  });

  test('formatDateForAPI should handle timezone correctly', () => {
    // Test with a date that could cause timezone issues
    const date = new Date(2024, 0, 15); // January 15, 2024 in local time
    const formatted = formatDateForAPI(date);
    expect(formatted).toBe('2024-01-15');
  });
});

describe('Form Utils', () => {
  test('validateEmail should validate email correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('validatePhone should validate phone correctly', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('+1234567890')).toBe(true);
    expect(validatePhone('abc')).toBe(false);
    expect(validatePhone('')).toBe(false);
  });
});

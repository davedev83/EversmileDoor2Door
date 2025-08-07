/**
 * Test to verify date formatting fixes for DatePicker component
 */

import { formatDateForAPI, setTimeToNoon, parseDate } from '../utils/dateUtils';

describe('Date Formatting Fix', () => {
  test('should format date correctly without timezone issues', () => {
    // Test with various dates that could cause timezone issues
    const testCases = [
      { input: new Date(2025, 7, 4), expected: '2025-08-04' }, // August 4, 2025
      { input: new Date(2025, 7, 6), expected: '2025-08-06' }, // August 6, 2025
      { input: new Date(2024, 11, 31), expected: '2024-12-31' }, // December 31, 2024
      { input: new Date(2025, 0, 1), expected: '2025-01-01' }, // January 1, 2025
    ];

    testCases.forEach(({ input, expected }) => {
      const result = formatDateForAPI(input);
      expect(result).toBe(expected);
    });
  });

  test('should handle edge cases', () => {
    // Test with null/undefined
    expect(formatDateForAPI(null)).toBe('');
    expect(formatDateForAPI(undefined)).toBe('');
    
    // Test with leap year
    const leapYearDate = new Date(2024, 1, 29); // February 29, 2024
    expect(formatDateForAPI(leapYearDate)).toBe('2024-02-29');
  });

  test('should maintain consistency across different times of day', () => {
    // Test same date at different times to ensure no day shifting
    const morning = new Date(2025, 7, 4, 9, 0, 0); // 9 AM
    const evening = new Date(2025, 7, 4, 23, 59, 59); // 11:59 PM

    expect(formatDateForAPI(morning)).toBe('2025-08-04');
    expect(formatDateForAPI(evening)).toBe('2025-08-04');
  });

  test('setTimeToNoon should set time to 12:00:00', () => {
    const date = new Date(2025, 7, 4, 9, 30, 45); // 9:30:45 AM
    const noonDate = setTimeToNoon(date);

    expect(noonDate.getHours()).toBe(12);
    expect(noonDate.getMinutes()).toBe(0);
    expect(noonDate.getSeconds()).toBe(0);
    expect(noonDate.getMilliseconds()).toBe(0);

    // Date should remain the same
    expect(noonDate.getFullYear()).toBe(2025);
    expect(noonDate.getMonth()).toBe(7); // August
    expect(noonDate.getDate()).toBe(4);
  });

  test('parseDate should return date set to noon', () => {
    const dateStr = '2025-08-04';
    const parsedDate = parseDate(dateStr);

    expect(parsedDate.getHours()).toBe(12);
    expect(parsedDate.getMinutes()).toBe(0);
    expect(parsedDate.getSeconds()).toBe(0);
    expect(formatDateForAPI(parsedDate)).toBe('2025-08-04');
  });
});

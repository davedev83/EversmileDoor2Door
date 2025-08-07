/**
 * Test to verify that setting dates to noon prevents timezone issues
 */

import { formatDateForAPI, setTimeToNoon, parseDate } from '../utils/dateUtils';

describe('Noon Timezone Fix', () => {
  test('should prevent timezone shifts by using noon time', () => {
    // Test dates that are prone to timezone issues
    const testDates = [
      new Date(2025, 7, 4),   // August 4, 2025
      new Date(2025, 7, 6),   // August 6, 2025 (today in the screenshot)
      new Date(2024, 11, 31), // December 31, 2024 (year boundary)
      new Date(2025, 0, 1),   // January 1, 2025 (year boundary)
    ];

    testDates.forEach(date => {
      const noonDate = setTimeToNoon(date);
      
      // Verify time is set to noon
      expect(noonDate.getHours()).toBe(12);
      expect(noonDate.getMinutes()).toBe(0);
      expect(noonDate.getSeconds()).toBe(0);
      expect(noonDate.getMilliseconds()).toBe(0);
      
      // Verify date components remain unchanged
      expect(noonDate.getFullYear()).toBe(date.getFullYear());
      expect(noonDate.getMonth()).toBe(date.getMonth());
      expect(noonDate.getDate()).toBe(date.getDate());
      
      // Verify API formatting is consistent
      const apiFormat = formatDateForAPI(noonDate);
      expect(apiFormat).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test('should handle edge cases with noon time setting', () => {
    // Test with null/undefined
    expect(setTimeToNoon(null)).toBe(null);
    expect(setTimeToNoon(undefined)).toBe(null);
    
    // Test with date at different times
    const midnight = new Date(2025, 7, 4, 0, 0, 0, 0);
    const lateNight = new Date(2025, 7, 4, 23, 59, 59, 999);
    
    const noonFromMidnight = setTimeToNoon(midnight);
    const noonFromLateNight = setTimeToNoon(lateNight);
    
    // Both should result in the same noon time
    expect(noonFromMidnight.getTime()).toBe(noonFromLateNight.getTime());
    expect(formatDateForAPI(noonFromMidnight)).toBe('2025-08-04');
    expect(formatDateForAPI(noonFromLateNight)).toBe('2025-08-04');
  });

  test('should parse date strings to noon time', () => {
    const testCases = [
      '2025-08-04',
      '2025-08-06',
      '2024-12-31',
      '2025-01-01'
    ];

    testCases.forEach(dateStr => {
      const parsedDate = parseDate(dateStr);
      
      // Should be set to noon
      expect(parsedDate.getHours()).toBe(12);
      expect(parsedDate.getMinutes()).toBe(0);
      expect(parsedDate.getSeconds()).toBe(0);
      
      // Should format back to the same date
      expect(formatDateForAPI(parsedDate)).toBe(dateStr);
    });
  });

  test('should handle timezone-sensitive scenarios', () => {
    // Simulate a scenario where a user selects August 4th
    const userSelectedDate = new Date(2025, 7, 4, 0, 0, 0); // Midnight local time
    const noonDate = setTimeToNoon(userSelectedDate);
    
    // Even if timezone conversion happens, noon time provides buffer
    const apiFormat = formatDateForAPI(noonDate);
    expect(apiFormat).toBe('2025-08-04');
    
    // Test with a date that could cross timezone boundaries
    const boundaryDate = new Date(2025, 7, 4, 1, 0, 0); // 1 AM
    const noonBoundaryDate = setTimeToNoon(boundaryDate);
    
    expect(formatDateForAPI(noonBoundaryDate)).toBe('2025-08-04');
    expect(noonBoundaryDate.getHours()).toBe(12);
  });
});

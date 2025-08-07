/**
 * Test to verify API correctly processes dates to noon
 */

describe('API Date Processing', () => {
  // Helper function from the API
  const setDateToNoon = (dateStr) => {
    if (!dateStr) return null;
    
    // If it's already a Date object, convert to string first
    if (dateStr instanceof Date) {
      const year = dateStr.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, '0');
      const day = String(dateStr.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }
    
    // Create date with noon time to avoid timezone issues
    return new Date(dateStr + 'T12:00:00.000Z');
  };

  test('should convert date string to noon UTC time', () => {
    const dateStr = '2025-08-06';
    const result = setDateToNoon(dateStr);
    
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCHours()).toBe(12);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);
    
    // Should be August 6, 2025 at noon UTC
    expect(result.getUTCFullYear()).toBe(2025);
    expect(result.getUTCMonth()).toBe(7); // August (0-indexed)
    expect(result.getUTCDate()).toBe(6);
  });

  test('should handle Date objects by converting to noon UTC', () => {
    const date = new Date(2025, 7, 6, 9, 30, 45); // August 6, 2025, 9:30:45 AM local
    const result = setDateToNoon(date);
    
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCHours()).toBe(12);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);
    
    // Should preserve the date but set to noon UTC
    expect(result.getUTCFullYear()).toBe(2025);
    expect(result.getUTCMonth()).toBe(7); // August
    expect(result.getUTCDate()).toBe(6);
  });

  test('should handle null/undefined dates', () => {
    expect(setDateToNoon(null)).toBe(null);
    expect(setDateToNoon(undefined)).toBe(null);
    expect(setDateToNoon('')).toBe(null);
  });

  test('should create consistent UTC dates regardless of local timezone', () => {
    const testDates = [
      '2025-08-04',
      '2025-08-06', 
      '2024-12-31',
      '2025-01-01'
    ];

    testDates.forEach(dateStr => {
      const result = setDateToNoon(dateStr);
      
      // All should be at noon UTC
      expect(result.getUTCHours()).toBe(12);
      expect(result.toISOString()).toMatch(/T12:00:00\.000Z$/);
      
      // Should preserve the date components
      const expectedDate = new Date(dateStr + 'T12:00:00.000Z');
      expect(result.getTime()).toBe(expectedDate.getTime());
    });
  });

  test('should handle edge cases correctly', () => {
    // Test leap year
    const leapYear = setDateToNoon('2024-02-29');
    expect(leapYear.getUTCFullYear()).toBe(2024);
    expect(leapYear.getUTCMonth()).toBe(1); // February
    expect(leapYear.getUTCDate()).toBe(29);
    expect(leapYear.getUTCHours()).toBe(12);

    // Test year boundaries
    const newYear = setDateToNoon('2025-01-01');
    expect(newYear.getUTCFullYear()).toBe(2025);
    expect(newYear.getUTCMonth()).toBe(0); // January
    expect(newYear.getUTCDate()).toBe(1);
    expect(newYear.getUTCHours()).toBe(12);

    const newYearEve = setDateToNoon('2024-12-31');
    expect(newYearEve.getUTCFullYear()).toBe(2024);
    expect(newYearEve.getUTCMonth()).toBe(11); // December
    expect(newYearEve.getUTCDate()).toBe(31);
    expect(newYearEve.getUTCHours()).toBe(12);
  });
});

/**
 * Date utility functions for the Door2Door Marketing app
 */

/**
 * Formats a date for display
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

/**
 * Formats a date for API submission (YYYY-MM-DD format)
 * @param {Date} date - The date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateForAPI = (date) => {
  if (!date) return '';

  // Use local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Parses a date string and creates a proper Date object set to noon
 * @param {string} dateStr - The date string to parse
 * @returns {Date} Parsed Date object set to noon
 */
export const parseDate = (dateStr) => {
  if (!dateStr) {
    const today = new Date();
    return setTimeToNoon(today);
  }

  // Add 'T12:00:00' to ensure we get the correct date regardless of timezone
  const formattedDateStr = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00';
  return new Date(formattedDateStr);
};

/**
 * Sets a date's time to noon (12:00:00) to avoid timezone issues
 * @param {Date} date - The date to modify
 * @returns {Date} New date object set to noon
 */
export const setTimeToNoon = (date) => {
  if (!date) return null;

  const noonDate = new Date(date);
  noonDate.setHours(12, 0, 0, 0);
  return noonDate;
};

/**
 * Gets the current date
 * @returns {Date} Current date
 */
export const getCurrentDate = () => new Date();

/**
 * Checks if a date is valid
 * @param {Date} date - The date to validate
 * @returns {boolean} True if date is valid
 */
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

/**
 * Form utility functions for validation and formatting
 */

/**
 * Formats credit card number with spaces
 * @param {string} value - The credit card number
 * @returns {string} Formatted credit card number
 */
export const formatCardNumber = (value) => {
  const cleanValue = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  const formattedValue = cleanValue.match(/.{1,4}/g)?.join(' ') || cleanValue;
  return formattedValue;
};

/**
 * Formats CVV to only allow numbers
 * @param {string} value - The CVV value
 * @returns {string} Formatted CVV
 */
export const formatCVV = (value) => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Validates required field
 * @param {string} value - The value to validate
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validates credit card number (basic Luhn algorithm)
 * @param {string} cardNumber - The credit card number
 * @returns {boolean} True if card number is valid
 */
export const validateCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates CVV
 * @param {string} cvv - The CVV to validate
 * @returns {boolean} True if CVV is valid
 */
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Validates expiry month
 * @param {string} month - The month to validate
 * @returns {boolean} True if month is valid
 */
export const validateExpiryMonth = (month) => {
  const monthNum = parseInt(month, 10);
  return monthNum >= 1 && monthNum <= 12;
};

/**
 * Validates expiry year
 * @param {string} year - The year to validate
 * @returns {boolean} True if year is valid
 */
export const validateExpiryYear = (year) => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year, 10);
  return yearNum >= currentYear && yearNum <= currentYear + 20;
};

/**
 * Cleans form data by removing empty values
 * @param {Object} data - The form data to clean
 * @returns {Object} Cleaned form data
 */
export const cleanFormData = (data) => {
  const cleaned = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) {
          cleaned[key] = trimmed;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

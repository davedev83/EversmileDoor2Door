/**
 * Application constants
 */

// Visit status constants
export const VISIT_STATUS = {
  DRAFT: 'draft',
  SAVED: 'saved'
};

// Form step constants
export const FORM_STEPS = {
  VISIT_DATE: 1,
  PRACTICE_INFO: 2,
  SAMPLES: 3,
  TOPICS: 4,
  SURVEY: 5,
  CREDIT_CARD: 6,
  REVIEW: 7
};

export const TOTAL_STEPS = 7;

// Pagination constants
export const VISITS_PER_PAGE = 10;

// Sample names
export const SAMPLE_NAMES = {
  ALIGNERFRESH_MINT: 'AlignerFresh Mint',
  ALIGNERFRESH_FLAVORS: 'AlignerFresh Flavors',
  ALLCLEAN_MINERALS: 'AllClean Minerals',
  IPR_GLIDE: 'IPR Glide',
  OTHER: 'Other'
};

// Credit card constants
export const CREDIT_CARD = {
  MIN_CVV_LENGTH: 3,
  MAX_CVV_LENGTH: 4,
  MIN_CARD_LENGTH: 13,
  MAX_CARD_LENGTH: 19
};

// Animation constants
export const ANIMATION = {
  SWIPE_THRESHOLD: 50,
  DRAFT_SAVE_DELAY: 3000
};

// API endpoints
export const API_ENDPOINTS = {
  VISITS: '/api/visits'
};

// Local storage keys
export const STORAGE_KEYS = {
  ADMIN_MODE: 'adminMode',
  DRAFT_DATA: 'draftData'
};

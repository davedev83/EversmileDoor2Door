/**
 * Sample utility functions for managing product samples
 */

/**
 * Sample configuration with IDs and display names
 */
export const SAMPLE_CONFIG = [
  { id: 'alignerfresh-mint', name: 'AlignerFresh Mint' },
  { id: 'alignerfresh-flavors', name: 'AlignerFresh Flavors' },
  { id: 'allclean-minerals', name: 'AllClean Minerals' },
  { id: 'ipr-glide', name: 'IPR Glide' },
  { id: 'other', name: 'Other' }
];

/**
 * Maps sample name to sample ID
 * @param {string} sampleName - The sample name
 * @returns {string} The sample ID
 */
export const getSampleId = (sampleName) => {
  const mapping = {
    'AlignerFresh Mint': 'alignerfresh-mint',
    'AlignerFresh Flavors': 'alignerfresh-flavors',
    'AllClean Minerals': 'allclean-minerals',
    'IPR Glide': 'ipr-glide',
    'Other': 'other'
  };
  return mapping[sampleName] || sampleName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Maps sample ID to sample name
 * @param {string} sampleId - The sample ID
 * @returns {string} The sample name
 */
export const getSampleName = (sampleId) => {
  const sample = SAMPLE_CONFIG.find(s => s.id === sampleId);
  return sample ? sample.name : sampleId;
};

/**
 * Gets all sample IDs
 * @returns {string[]} Array of sample IDs
 */
export const getAllSampleIds = () => {
  return SAMPLE_CONFIG.map(sample => sample.id);
};

/**
 * Formats samples for display
 * @param {Array} samplesProvided - Array of sample objects with name and quantity
 * @returns {string} Formatted string of samples
 */
export const formatSamplesForDisplay = (samplesProvided) => {
  if (!samplesProvided || samplesProvided.length === 0) {
    return 'None';
  }
  
  return samplesProvided
    .filter(sample => sample.quantity > 0)
    .map(sample => `${sample.name}: ${sample.quantity}`)
    .join(', ');
};

/**
 * Validates sample data
 * @param {Array} samplesProvided - Array of sample objects
 * @returns {boolean} True if samples are valid
 */
export const validateSamples = (samplesProvided) => {
  if (!Array.isArray(samplesProvided)) return false;
  
  return samplesProvided.every(sample => 
    sample.name && 
    typeof sample.quantity === 'number' && 
    sample.quantity >= 0
  );
};

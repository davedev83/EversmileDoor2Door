/**
 * Visit service for API operations
 */

import { API_ENDPOINTS, VISITS_PER_PAGE } from '../utils/constants';

/**
 * Fetches visits with pagination
 * @param {number} page - Page number
 * @param {number} limit - Number of visits per page
 * @returns {Promise<Object>} Visit data with pagination info
 */
export const fetchVisits = async (page = 1, limit = VISITS_PER_PAGE) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.VISITS}?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      visits: data.visits || data,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || page,
      totalVisits: data.totalVisits || 0,
      hasNextPage: data.hasNextPage || false,
      hasPrevPage: data.hasPrevPage || false
    };
  } catch (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
};

/**
 * Creates a new visit
 * @param {Object} visitData - Visit data to create
 * @returns {Promise<Object>} Created visit response
 */
export const createVisit = async (visitData) => {
  try {
    const response = await fetch(API_ENDPOINTS.VISITS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create visit');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};

/**
 * Updates an existing visit
 * @param {Object} visitData - Visit data to update (must include _id)
 * @returns {Promise<Object>} Updated visit response
 */
export const updateVisit = async (visitData) => {
  try {
    if (!visitData._id) {
      throw new Error('Visit ID is required for updates');
    }
    
    const response = await fetch(API_ENDPOINTS.VISITS, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update visit');
    }
    
    return result;
  } catch (error) {
    console.error('Error updating visit:', error);
    throw error;
  }
};

/**
 * Deletes a visit
 * @param {string} visitId - ID of the visit to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteVisit = async (visitId) => {
  try {
    if (!visitId) {
      throw new Error('Visit ID is required for deletion');
    }
    
    const response = await fetch(`${API_ENDPOINTS.VISITS}?id=${visitId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete visit');
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting visit:', error);
    throw error;
  }
};

/**
 * Saves a visit (create or update based on whether it has an ID)
 * @param {Object} visitData - Visit data to save
 * @param {boolean} hasVisitId - Whether this visit has an ID (for update) or should be created
 * @returns {Promise<Object>} Save response
 */
export const saveVisit = async (visitData, hasVisitId = false) => {
  // If we have a visit ID in the data, always update
  if (visitData._id) {
    return updateVisit(visitData);
  } else {
    return createVisit(visitData);
  }
};

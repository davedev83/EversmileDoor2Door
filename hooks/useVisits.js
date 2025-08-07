/**
 * Custom hook for managing visits state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchVisits, deleteVisit } from '../services/visitService';
import { VISITS_PER_PAGE } from '../utils/constants';

export const useVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  /**
   * Loads visits from the API
   */
  const loadVisits = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchVisits(page, VISITS_PER_PAGE);

      setVisits(data.visits);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading visits:', error);

      // Handle authentication errors gracefully
      if (error.message.includes('Authentication required') ||
          error.message.includes('Session expired')) {
        // Don't set error for auth issues, let the auth system handle it
        setVisits([]);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a visit
   */
  const handleDeleteVisit = useCallback(async (visitId, practiceName) => {
    if (!confirm(`Are you sure you want to delete the visit for "${practiceName}"? This action cannot be undone.`)) {
      return false;
    }

    try {
      await deleteVisit(visitId);
      
      // Refresh the visits list
      await loadVisits(currentPage);
      return true;
    } catch (error) {
      console.error('Error deleting visit:', error);
      alert('Error deleting visit: ' + error.message);
      return false;
    }
  }, [currentPage, loadVisits]);

  /**
   * Refreshes the current page
   */
  const refreshVisits = useCallback(() => {
    loadVisits(currentPage);
  }, [currentPage, loadVisits]);

  /**
   * Goes to next page
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      loadVisits(currentPage + 1);
    }
  }, [currentPage, totalPages, loadVisits]);

  /**
   * Goes to previous page
   */
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      loadVisits(currentPage - 1);
    }
  }, [currentPage, loadVisits]);

  // Don't automatically load visits on mount
  // Let the parent component control when to load visits

  return {
    visits,
    loading,
    error,
    currentPage,
    totalPages,
    loadVisits,
    handleDeleteVisit,
    refreshVisits,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

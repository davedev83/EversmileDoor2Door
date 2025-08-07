/**
 * Authentication hook for managing login state
 */

import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setError(data.error);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setError('Failed to check authentication status');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login with password
   */
  const login = useCallback(async (password) => {
    try {
      setError(null);

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(false);
        setUser(null);
        return { success: true };
      } else {
        setError(data.error || 'Logout failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: 'Logout failed' };
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    loading,
    user,
    error,
    login,
    logout,
    checkAuth,
    clearError: () => setError(null)
  };
};

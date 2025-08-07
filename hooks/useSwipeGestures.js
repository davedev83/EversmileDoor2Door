/**
 * Custom hook for handling swipe gestures
 */

import { useEffect, useCallback } from 'react';
import { ANIMATION } from '../utils/constants';

export const useSwipeGestures = (onSwipeLeft, onSwipeRight) => {
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    e.target.startX = touch.clientX;
    e.target.startY = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!e.target.startX || !e.target.startY) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    
    const diffX = e.target.startX - endX;
    const diffY = e.target.startY - endY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > ANIMATION.SWIPE_THRESHOLD) {
      if (diffX > 0) {
        // Swipe left - next step
        onSwipeLeft?.();
      } else {
        // Swipe right - previous step
        onSwipeRight?.();
      }
    }

    e.target.startX = 0;
    e.target.startY = 0;
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return {
    // This hook doesn't return anything, it just sets up event listeners
  };
};

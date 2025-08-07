/**
 * Visit list component with pagination
 */

import React from 'react';
import VisitCard from './VisitCard';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const VisitList = ({ 
  visits = [], 
  loading = false, 
  isAdminMode = false,
  currentPage = 1,
  totalPages = 1,
  onEditVisit,
  onDeleteVisit,
  onNextPage,
  onPrevPage,
  hasNextPage = false,
  hasPrevPage = false
}) => {
  if (loading) {
    return <LoadingSpinner message="Loading visits..." />;
  }

  if (visits.length === 0) {
    return (
      <div className="no-visits">
        <h3>No visits recorded yet</h3>
        <p>Click &quot;Add New Visit&quot; to get started</p>
        
        <style jsx>{`
          .no-visits {
            text-align: center;
            padding: 40px;
            color: #666;
          }

          .no-visits h3 {
            margin-bottom: 10px;
            color: #333;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="visit-list">
      <h2 className="visits-title">Recent Visits</h2>

      <div className="visits-scroll-container">
        <div className="visits-container">
          {visits.map((visit) => (
            <VisitCard
              key={visit._id}
              visit={visit}
              isAdminMode={isAdminMode}
              onEdit={onEditVisit}
              onDelete={onDeleteVisit}
            />
          ))}
        </div>
      </div>

      {/* Pagination - Show when there are multiple pages or when loading */}
      {(totalPages > 1 || loading) && (
        <div className="pagination">
          <Button
            onClick={onPrevPage}
            disabled={!hasPrevPage || loading}
            variant="secondary"
            size="small"
          >
            ← Previous
          </Button>
          <span className="pagination-info">
            {loading ? 'Loading...' : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button
            onClick={onNextPage}
            disabled={!hasNextPage || loading}
            variant="secondary"
            size="small"
          >
            Next →
          </Button>
        </div>
      )}

      <style jsx>{`
        .visit-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0; /* Important for flex child to shrink */
        }

        .visits-title {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
          text-align: center;
          flex-shrink: 0; /* Don't shrink the title */
        }

        .visits-scroll-container {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
          overscroll-behavior: contain; /* Prevent bounce on mobile */
          padding-right: 5px; /* Space for scrollbar */
          margin-right: -5px; /* Offset the padding */
          /* Ensure proper scrolling on mobile */
          touch-action: pan-y;
          scroll-behavior: smooth;
        }

        .visits-container {
          padding: 20px 0;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 15px 20px;
          background: white;
          border-top: 1px solid #e0e0e0;
          flex-shrink: 0; /* Don't shrink the pagination */
          margin-top: auto; /* Push to bottom */
        }

        .pagination-info {
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .visits-title {
            font-size: 20px;
            margin-bottom: 15px;
          }

          .pagination {
            gap: 15px;
            padding: 12px 15px;
          }

          .pagination-info {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default VisitList;

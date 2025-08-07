/**
 * Visit card component for displaying visit information
 */

import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const VisitCard = ({ 
  visit, 
  isAdminMode = false, 
  onEdit, 
  onDelete 
}) => {
  const handleEditClick = () => {
    onEdit?.(visit);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(visit._id, visit.practiceName);
  };

  return (
    <div className={`visit-card ${visit.status || 'saved'} ${isAdminMode ? 'admin-mode' : ''}`}>
      <div className="visit-content" onClick={handleEditClick}>
        <div className="visit-header">
          <div className="practice-name">{visit.practiceName}</div>
          <div className={`visit-status ${visit.status === 'saved' ? 'status-saved' : 'status-draft'}`}>
            {visit.status || 'saved'}
          </div>
        </div>
        <div className="visit-details">
          <div className="visit-date">
            {formatDate(visit.visitDate)}
          </div>
          <div>{visit.phone}</div>
          <div>{visit.email}</div>
        </div>
      </div>
      {isAdminMode && (
        <button
          className="delete-btn"
          onClick={handleDeleteClick}
          title="Delete visit"
        >
          🗑️
        </button>
      )}
      
      <style jsx>{`
        .visit-card {
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .visit-card:hover {
          background: #C7E8FF;
          border-color: #127BB8;
          transform: translateY(-2px);
        }

        .visit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .practice-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .visit-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-saved {
          background: #C7E8FF;
          color: #127BB8;
        }

        .status-draft {
          background: #C7E8FF;
          color: #127BB8;
        }

        .visit-card.draft {
          border-left: 4px solid #127BB8;
        }

        .visit-card.saved {
          border-left: 4px solid #127BB8;
        }

        .visit-card.admin-mode {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px 20px 16px 16px;
        }

        .visit-content {
          flex: 1;
          cursor: pointer;
        }

        .visit-card.admin-mode .visit-content:hover {
          opacity: 0.8;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          height: 44px;
        }

        .delete-btn:hover {
          background: #c82333;
          transform: scale(1.05);
        }

        .delete-btn:active {
          transform: scale(0.95);
        }

        .visit-details {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }

        .visit-date {
          font-weight: 500;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default VisitCard;

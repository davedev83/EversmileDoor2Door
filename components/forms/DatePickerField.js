/**
 * Date picker field component
 */

import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { setTimeToNoon } from '../../utils/dateUtils';

const DatePickerField = ({
  label,
  selectedDate,
  onChange,
  error,
  required = false,
  ...props
}) => {

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Wrapper function to ensure selected dates are set to noon
  const handleDateChange = (date) => {
    if (date && onChange) {
      const noonDate = setTimeToNoon(date);
      onChange(noonDate);
    } else if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="date-input-group">
      <div className="date-input-container">
        <input
          type="text"
          value={formatDisplayDate(selectedDate)}
          readOnly
          className={`date-display-input ${error ? 'error' : ''}`}
          placeholder="MM/DD/YYYY"
        />
        <div className="calendar-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      <div className="calendar-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
          calendarClassName="date-picker-calendar"
          {...props}
        />
      </div>

      {error && <span className="error-message">{error}</span>}

      <style jsx global>{`
        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 10px;
          padding: 0 20px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          min-height: 100%;
        }

        .date-input-container {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .date-display-input {
          width: 100%;
          padding: 16px 50px 16px 16px;
          font-size: 16px;
          border: 2px solid #127BB8;
          border-radius: 12px;
          background: white;
          transition: all 0.3s ease;
          font-family: inherit;
          box-sizing: border-box;
          color: #333;
        }

        .date-display-input:focus {
          outline: none;
          border-color: #127BB8;
          box-shadow: 0 0 0 3px rgba(18, 123, 184, 0.1);
        }

        .date-display-input.error {
          border-color: #dc3545;
        }

        .calendar-container {
          display: flex;
          justify-content: center;
          margin-top: 5px;
          flex: 1;
          min-height: 0;
          overflow-y: visible;
          padding-bottom: 20px;
        }

        .calendar-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #666;
          pointer-events: none;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .date-picker-calendar {
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          font-family: inherit !important;
          background: white !important;
          width: 100% !important;
          max-width: 320px !important;
          margin: 0 auto !important;
          overflow: hidden !important;
          max-height: 350px !important;
        }

        .react-datepicker {
          border: none !important;
          border-radius: 12px !important;
          font-family: inherit !important;
          width: 100% !important;
        }

        .react-datepicker__header {
          background: #127BB8 !important;
          border-bottom: none !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 15px 0 10px 0 !important;
          position: relative !important;
        }

        .react-datepicker__current-month {
          color: white !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          margin-bottom: 10px !important;
          text-align: center !important;
        }

        .react-datepicker__day-names {
          display: flex !important;
          justify-content: space-between !important;
          margin: 0 !important;
          padding: 0 15px !important;
          background: #127BB8 !important;
        }

        .react-datepicker__day-name {
          color: white !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          width: 2.5rem !important;
          margin: 0 !important;
          text-align: center !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .react-datepicker__navigation {
          top: 15px !important;
          width: 30px !important;
          height: 30px !important;
          border: none !important;
          background: none !important;
          text-indent: -999px !important;
          overflow: visible !important;
          cursor: pointer !important;
          position: absolute !important;
          font-size: 0 !important;
          z-index: 10 !important;
        }

        .react-datepicker__navigation-icon {
          display: none !important;
        }

        .react-datepicker__navigation-icon--previous,
        .react-datepicker__navigation-icon--next {
          display: none !important;
        }

        .react-datepicker__navigation span {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }

        .react-datepicker__navigation-icon--previous:before,
        .react-datepicker__navigation-icon--next:before {
          display: none !important;
        }

        .react-datepicker__navigation:before {
          content: '' !important;
          border: none !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-indent: 0 !important;
          z-index: 11 !important;
        }

        .react-datepicker__navigation--previous {
          left: 15px !important;
        }

        .react-datepicker__navigation--previous:before {
          content: '‹' !important;
          color: white !important;
          font-size: 24px !important;
          font-weight: bold !important;
          line-height: 1 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .react-datepicker__navigation--next {
          right: 15px !important;
        }

        .react-datepicker__navigation--next:before {
          content: '›' !important;
          color: white !important;
          font-size: 24px !important;
          font-weight: bold !important;
          line-height: 1 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .react-datepicker__navigation:hover:before {
          opacity: 0.8 !important;
        }

        .react-datepicker__month {
          margin: 0 !important;
          padding: 10px !important;
          background: white !important;
          border-radius: 0 0 12px 12px !important;
        }

        .react-datepicker__month-container {
          float: none !important;
          width: 100% !important;
        }

        .react-datepicker__week {
          display: flex !important;
          justify-content: space-around !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .react-datepicker__day {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          margin: 1px !important;
          border-radius: 6px !important;
          font-size: 13px !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #333 !important;
          text-align: center !important;
          cursor: pointer !important;
          border: none !important;
          background: transparent !important;
        }

        .react-datepicker__day:hover {
          background: #C7E8FF !important;
          color: #127BB8 !important;
        }

        /* Reset today's date styling completely - no special highlighting */
        .react-datepicker__day--today {
          font-weight: 400 !important;
          color: #333 !important;
          background: transparent !important;
          border: none !important;
        }

        .react-datepicker__day--today:hover {
          background: #C7E8FF !important;
          color: #127BB8 !important;
        }

        /* Only selected dates get blue background */
        .react-datepicker__day--selected {
          background: #127BB8 !important;
          color: white !important;
          font-weight: 600 !important;
          border: none !important;
        }

        /* Ensure selected today also gets blue background */
        .react-datepicker__day--today.react-datepicker__day--selected {
          background: #127BB8 !important;
          color: white !important;
          font-weight: 600 !important;
          border: none !important;
        }

        .react-datepicker__day--outside-month {
          color: #ccc !important;
          opacity: 0.5 !important;
        }

        /* Remove keyboard-selected styling unless it's actually selected */
        .react-datepicker__day--keyboard-selected {
          background: transparent !important;
          color: #333 !important;
          font-weight: 400 !important;
        }

        .react-datepicker__day--keyboard-selected.react-datepicker__day--selected {
          background: #127BB8 !important;
          color: white !important;
          font-weight: 600 !important;
        }

        .error-message {
          display: block;
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
        }

        /* Ultra-specific overrides to force correct styling */
        .date-picker-calendar .react-datepicker__day--today:not(.react-datepicker__day--selected) {
          background: transparent !important;
          color: #333 !important;
          font-weight: 400 !important;
          border: none !important;
        }

        .date-picker-calendar .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--selected) {
          background: transparent !important;
          color: #333 !important;
          font-weight: 400 !important;
        }

        .date-picker-calendar .react-datepicker__day--today.react-datepicker__day--keyboard-selected:not(.react-datepicker__day--selected) {
          background: transparent !important;
          color: #333 !important;
          font-weight: 400 !important;
        }

        /* Only truly selected dates get blue styling */
        .date-picker-calendar .react-datepicker__day--selected {
          background: #127BB8 !important;
          color: white !important;
          font-weight: 600 !important;
          border: none !important;
        }

        /* Mobile-specific improvements */
        @media (max-width: 480px) {
          .date-input-group {
            min-height: 100%;
            padding-bottom: 40px;
          }

          .calendar-container {
            padding-bottom: 40px;
          }

          .date-picker-calendar {
            max-width: 280px !important;
            max-height: 300px !important;
          }
        }

        /* Ensure proper touch scrolling on iOS */
        @supports (-webkit-overflow-scrolling: touch) {
          .date-input-group,
          .calendar-container {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

export default DatePickerField;

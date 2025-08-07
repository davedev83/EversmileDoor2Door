/**
 * Email service for sending notifications
 * This module handles email template generation and sending logic
 */

import { formatSamplesForDisplay } from '../utils/sampleUtils';
import { formatDate } from '../utils/dateUtils';

/**
 * Generates email HTML content for visit notifications
 * @param {Object} visitData - Visit data
 * @param {string} type - Email type ('new', 'update', 'submit')
 * @returns {string} HTML email content
 */
export const generateVisitEmailHTML = (visitData, type = 'new') => {
  const emailHeaders = {
    new: '<h2>New Visit Recorded</h2>',
    update: '<h2>Visit Updated</h2>',
    submit: '<h2>New Visit Submitted</h2>'
  };

  const header = emailHeaders[type] || emailHeaders.new;
  
  return `
    ${header}
    <p><strong>Practice:</strong> ${visitData.practiceName}</p>
    <p><strong>Date:</strong> ${formatDate(visitData.visitDate)}</p>
    <p><strong>Phone:</strong> ${visitData.phone}</p>
    <p><strong>Email:</strong> ${visitData.email}</p>
    <p><strong>Address:</strong> ${visitData.address}</p>
    <p><strong>Samples:</strong> ${formatSamplesForDisplay(visitData.samplesProvided)}</p>
    ${visitData.otherSample ? `<p><strong>Other Sample:</strong> ${visitData.otherSample}</p>` : ''}
    <p><strong>Topics Discussed:</strong> ${visitData.topicsDiscussed}</p>
    ${visitData.creditCard && visitData.creditCard.number ? 
      '<p><strong>Credit Card:</strong> Provided</p>' : 
      '<p><strong>Credit Card:</strong> Not provided</p>'
    }
  `;
};

/**
 * Generates email subject line
 * @param {Object} visitData - Visit data
 * @param {string} type - Email type ('new', 'update', 'submit')
 * @returns {string} Email subject
 */
export const generateEmailSubject = (visitData, type = 'new') => {
  const subjectTemplates = {
    new: `New Visit Recorded - ${visitData.practiceName}`,
    update: `[UPDATE] Visit Updated - ${visitData.practiceName}`,
    submit: `Visit Submitted - ${visitData.practiceName}`
  };

  return subjectTemplates[type] || subjectTemplates.new;
};

/**
 * Creates email message object for SendGrid
 * @param {Object} visitData - Visit data
 * @param {string} type - Email type
 * @param {string} toEmail - Recipient email
 * @param {string} fromEmail - Sender email
 * @returns {Object} Email message object
 */
export const createEmailMessage = (visitData, type, toEmail, fromEmail) => {
  return {
    to: toEmail,
    from: fromEmail,
    subject: generateEmailSubject(visitData, type),
    html: generateVisitEmailHTML(visitData, type)
  };
};

/**
 * Determines email type based on visit state and update status
 * @param {Object} visitData - Visit data
 * @param {boolean} isRealUpdate - Whether this is a real update
 * @returns {string} Email type
 */
export const determineEmailType = (visitData, isRealUpdate = false) => {
  if (isRealUpdate) {
    return 'update';
  } else if (visitData.status === 'saved') {
    return 'submit';
  } else {
    return 'new';
  }
};

import { connectToDatabase, Visit, Session } from '../../lib/mongodb';
import { getSession } from '../../lib/session';
import sgMail from '@sendgrid/mail';

// Helper function to ensure date is set to noon to avoid timezone issues
const setDateToNoon = (dateStr) => {
  if (!dateStr) return null;

  // If it's already a Date object, convert to string first
  if (dateStr instanceof Date) {
    const year = dateStr.getFullYear();
    const month = String(dateStr.getMonth() + 1).padStart(2, '0');
    const day = String(dateStr.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  }

  // Create date with noon time to avoid timezone issues
  return new Date(dateStr + 'T12:00:00.000Z');
};

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();

    // Check authentication
    const session = await getSession(req, res);

    if (!session.isAuthenticated || !session.sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Verify session exists in database and is not expired
    const sessionDoc = await Session.findOne({
      sessionId: session.sessionId,
      isAuthenticated: true,
      expiresAt: { $gt: new Date() }
    });

    if (!sessionDoc) {
      // Session expired or invalid, clear it
      session.isAuthenticated = false;
      session.userId = null;
      session.sessionId = null;
      await session.save();

      return res.status(401).json({
        success: false,
        error: 'Session expired. Please login again.'
      });
    }

    if (req.method === 'POST') {
      // Create new visit
      const requestData = { ...req.body };

      // Process visitDate to ensure it's set to noon
      if (requestData.visitDate) {
        requestData.visitDate = setDateToNoon(requestData.visitDate);
      }

      const visitData = new Visit(requestData);
      const savedVisit = await visitData.save();

      // Send email notification only for saved visits (not drafts)
      if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL && visitData.status === 'saved') {
        const msg = {
          to: process.env.NOTIFICATION_EMAIL,
          from: process.env.FROM_EMAIL || 'noreply@door2door.com',
          subject: `New Visit Recorded - ${visitData.practiceName}`,
          html: `
            <h2>New Visit Recorded</h2>
            <h3>Practice Information</h3>
            <p><strong>Practice:</strong> ${visitData.practiceName}</p>
            <p><strong>Date:</strong> ${visitData.visitDate}</p>
            <p><strong>Phone:</strong> ${visitData.phone}</p>
            <p><strong>Email:</strong> ${visitData.email}</p>
            <p><strong>Address:</strong> ${visitData.address}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Staff Information</h3>
            ${visitData.drName ? `<p><strong>Doctor Name:</strong> ${visitData.drName}</p>` : ''}
            ${visitData.frontDeskName ? `<p><strong>Front Desk Name:</strong> ${visitData.frontDeskName}</p>` : ''}
            ${visitData.backOfficeAssistantName ? `<p><strong>Back Office Assistant:</strong> ${visitData.backOfficeAssistantName}</p>` : ''}
            ${visitData.officeManagerName ? `<p><strong>Office Manager:</strong> ${visitData.officeManagerName}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Samples Provided</h3>
            <p><strong>Samples:</strong> ${visitData.samplesProvided.map(sample =>
              typeof sample === 'object' ? `${sample.name}: ${sample.quantity}` : sample
            ).join(', ') || 'None'}</p>
            ${visitData.otherSample ? `<p><strong>Other Sample:</strong> ${visitData.otherSample}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Visit Details</h3>
            <p><strong>Topics Discussed:</strong> ${visitData.topicsDiscussed || 'None'}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Survey Responses</h3>
            ${visitData.survey ? `
              <p><strong>Knew about products before visit:</strong> ${visitData.survey.knewAboutProducts !== null ? (visitData.survey.knewAboutProducts ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Sold products before:</strong> ${visitData.survey.soldProductsBefore !== null ? (visitData.survey.soldProductsBefore ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Interested in AlignerFresh:</strong> ${visitData.survey.interestedInAlignerFresh !== null ? (visitData.survey.interestedInAlignerFresh ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Gave IPR Glide sample:</strong> ${visitData.survey.gaveIPRGlideSample !== null ? (visitData.survey.gaveIPRGlideSample ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Spoke to doctor:</strong> ${visitData.survey.spokeToDoctor !== null ? (visitData.survey.spokeToDoctor ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Showed Smart IPR video:</strong> ${visitData.survey.showedSmartIPRVideo !== null ? (visitData.survey.showedSmartIPRVideo ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Quoted prices:</strong> ${visitData.survey.quotedPrices !== null ? (visitData.survey.quotedPrices ? 'Yes' : 'No') : 'Not answered'}</p>
              ${visitData.survey.quotedPricesDetails ? `<p><strong>Price details:</strong> ${visitData.survey.quotedPricesDetails}</p>` : ''}
              <p><strong>Ready to order:</strong> ${visitData.survey.readyToOrder !== null ? (visitData.survey.readyToOrder ? 'Yes' : 'No') : 'Not answered'}</p>
              ${visitData.survey.readyToOrderDetails ? `<p><strong>Order details:</strong> ${visitData.survey.readyToOrderDetails}</p>` : ''}
              ${visitData.survey.officeDescription ? `<p><strong>Office description:</strong> ${visitData.survey.officeDescription}</p>` : ''}
            ` : '<p>No survey data provided</p>'}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Payment Information</h3>
            ${visitData.creditCard && visitData.creditCard.number ? '<p><strong>Credit Card:</strong> Provided</p>' : '<p><strong>Credit Card:</strong> Not provided</p>'}
          `
        };

        try {
          await sgMail.send(msg);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.status(201).json({ success: true, visitId: savedVisit._id });

    } else if (req.method === 'PUT') {
      // Update existing visit
      const visitId = req.body._id;
      if (!visitId) {
        return res.status(400).json({ success: false, error: 'Visit ID is required for updates' });
      }

      const updateData = { ...req.body };

      // Process visitDate to ensure it's set to noon
      if (updateData.visitDate) {
        updateData.visitDate = setDateToNoon(updateData.visitDate);
      }

      const updatedVisit = await Visit.findByIdAndUpdate(visitId, updateData, { new: true });

      if (!updatedVisit) {
        return res.status(404).json({ success: false, error: 'Visit not found' });
      }

      // Send email notifications based on visit state
      if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL && updatedVisit.status === 'saved') {
        let emailSubject, emailHeader;

        if (req.body.isRealUpdate) {
          // True update: previously saved visit being modified
          emailSubject = `[UPDATE] Visit Updated - ${updatedVisit.practiceName}`;
          emailHeader = '<h2>Visit Updated</h2>';
        } else {
          // First save: new visit or draft being saved for the first time
          emailSubject = `Visit Submitted - ${updatedVisit.practiceName}`;
          emailHeader = '<h2>New Visit Submitted</h2>';
        }

        const msg = {
          to: process.env.NOTIFICATION_EMAIL,
          from: process.env.FROM_EMAIL || 'noreply@door2door.com',
          subject: emailSubject,
          html: `
            ${emailHeader}
            <h3>Practice Information</h3>
            <p><strong>Practice:</strong> ${updatedVisit.practiceName}</p>
            <p><strong>Date:</strong> ${updatedVisit.visitDate}</p>
            <p><strong>Phone:</strong> ${updatedVisit.phone}</p>
            <p><strong>Email:</strong> ${updatedVisit.email}</p>
            <p><strong>Address:</strong> ${updatedVisit.address}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Staff Information</h3>
            ${updatedVisit.drName ? `<p><strong>Doctor Name:</strong> ${updatedVisit.drName}</p>` : ''}
            ${updatedVisit.frontDeskName ? `<p><strong>Front Desk Name:</strong> ${updatedVisit.frontDeskName}</p>` : ''}
            ${updatedVisit.backOfficeAssistantName ? `<p><strong>Back Office Assistant:</strong> ${updatedVisit.backOfficeAssistantName}</p>` : ''}
            ${updatedVisit.officeManagerName ? `<p><strong>Office Manager:</strong> ${updatedVisit.officeManagerName}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Samples Provided</h3>
            <p><strong>Samples:</strong> ${updatedVisit.samplesProvided.map(sample =>
              typeof sample === 'object' ? `${sample.name}: ${sample.quantity}` : sample
            ).join(', ') || 'None'}</p>
            ${updatedVisit.otherSample ? `<p><strong>Other Sample:</strong> ${updatedVisit.otherSample}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Visit Details</h3>
            <p><strong>Topics Discussed:</strong> ${updatedVisit.topicsDiscussed || 'None'}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Survey Responses</h3>
            ${updatedVisit.survey ? `
              <p><strong>Knew about products before visit:</strong> ${updatedVisit.survey.knewAboutProducts !== null ? (updatedVisit.survey.knewAboutProducts ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Sold products before:</strong> ${updatedVisit.survey.soldProductsBefore !== null ? (updatedVisit.survey.soldProductsBefore ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Interested in AlignerFresh:</strong> ${updatedVisit.survey.interestedInAlignerFresh !== null ? (updatedVisit.survey.interestedInAlignerFresh ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Gave IPR Glide sample:</strong> ${updatedVisit.survey.gaveIPRGlideSample !== null ? (updatedVisit.survey.gaveIPRGlideSample ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Spoke to doctor:</strong> ${updatedVisit.survey.spokeToDoctor !== null ? (updatedVisit.survey.spokeToDoctor ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Showed Smart IPR video:</strong> ${updatedVisit.survey.showedSmartIPRVideo !== null ? (updatedVisit.survey.showedSmartIPRVideo ? 'Yes' : 'No') : 'Not answered'}</p>
              <p><strong>Quoted prices:</strong> ${updatedVisit.survey.quotedPrices !== null ? (updatedVisit.survey.quotedPrices ? 'Yes' : 'No') : 'Not answered'}</p>
              ${updatedVisit.survey.quotedPricesDetails ? `<p><strong>Price details:</strong> ${updatedVisit.survey.quotedPricesDetails}</p>` : ''}
              <p><strong>Ready to order:</strong> ${updatedVisit.survey.readyToOrder !== null ? (updatedVisit.survey.readyToOrder ? 'Yes' : 'No') : 'Not answered'}</p>
              ${updatedVisit.survey.readyToOrderDetails ? `<p><strong>Order details:</strong> ${updatedVisit.survey.readyToOrderDetails}</p>` : ''}
              ${updatedVisit.survey.officeDescription ? `<p><strong>Office description:</strong> ${updatedVisit.survey.officeDescription}</p>` : ''}
            ` : '<p>No survey data provided</p>'}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

            <h3>Payment Information</h3>
            ${updatedVisit.creditCard && updatedVisit.creditCard.number ? '<p><strong>Credit Card:</strong> Provided</p>' : '<p><strong>Credit Card:</strong> Not provided</p>'}
          `
        };

        try {
          await sgMail.send(msg);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.status(200).json({ success: true, visitId: updatedVisit._id });

    } else if (req.method === 'GET') {
      // Get visits with pagination and sorting
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Sort by visitDate (newest first), then by createdAt as fallback
      const visits = await Visit.find()
        .sort({ visitDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalVisits = await Visit.countDocuments();
      const totalPages = Math.ceil(totalVisits / limit);

      res.status(200).json({
        visits,
        currentPage: page,
        totalPages,
        totalVisits,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      });

    } else if (req.method === 'DELETE') {
      // Delete visit
      const visitId = req.query.id || req.body.id;
      if (!visitId) {
        return res.status(400).json({ success: false, error: 'Visit ID is required for deletion' });
      }

      const deletedVisit = await Visit.findByIdAndDelete(visitId);

      if (!deletedVisit) {
        return res.status(404).json({ success: false, error: 'Visit not found' });
      }

      res.status(200).json({ success: true, message: 'Visit deleted successfully' });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
}

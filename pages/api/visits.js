import { connectToDatabase, Visit } from '../../lib/mongodb';
import sgMail from '@sendgrid/mail';

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

    if (req.method === 'POST') {
      // Create new visit
      const visitData = new Visit(req.body);
      const savedVisit = await visitData.save();

      // Send email notification only for saved visits (not drafts)
      if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL && visitData.status === 'saved') {
        const msg = {
          to: process.env.NOTIFICATION_EMAIL,
          from: process.env.FROM_EMAIL || 'noreply@door2door.com',
          subject: `New Visit Recorded - ${visitData.practiceName}`,
          html: `
            <h2>New Visit Recorded</h2>
            <p><strong>Practice:</strong> ${visitData.practiceName}</p>
            <p><strong>Date:</strong> ${visitData.visitDate}</p>
            <p><strong>Phone:</strong> ${visitData.phone}</p>
            <p><strong>Email:</strong> ${visitData.email}</p>
            <p><strong>Address:</strong> ${visitData.address}</p>
            <p><strong>Samples:</strong> ${visitData.samplesProvided.map(sample =>
              typeof sample === 'object' ? `${sample.name}: ${sample.quantity}` : sample
            ).join(', ')}</p>
            ${visitData.otherSample ? `<p><strong>Other Sample:</strong> ${visitData.otherSample}</p>` : ''}
            <p><strong>Topics Discussed:</strong> ${visitData.topicsDiscussed}</p>
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

      const updatedVisit = await Visit.findByIdAndUpdate(visitId, req.body, { new: true });

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
            <p><strong>Practice:</strong> ${updatedVisit.practiceName}</p>
            <p><strong>Date:</strong> ${updatedVisit.visitDate}</p>
            <p><strong>Phone:</strong> ${updatedVisit.phone}</p>
            <p><strong>Email:</strong> ${updatedVisit.email}</p>
            <p><strong>Address:</strong> ${updatedVisit.address}</p>
            <p><strong>Samples:</strong> ${updatedVisit.samplesProvided.map(sample =>
              typeof sample === 'object' ? `${sample.name}: ${sample.quantity}` : sample
            ).join(', ')}</p>
            ${updatedVisit.otherSample ? `<p><strong>Other Sample:</strong> ${updatedVisit.otherSample}</p>` : ''}
            <p><strong>Topics Discussed:</strong> ${updatedVisit.topicsDiscussed}</p>
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

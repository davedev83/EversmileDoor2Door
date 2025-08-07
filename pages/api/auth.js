import { getSession } from '../../lib/session';
import { connectToDatabase, Session } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

// The hardcoded password (in production, this should be in environment variables)
const EVERSMILE_PASSWORD = 'myeversmile';

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

  const session = await getSession(req, res);

  try {
    await connectToDatabase();

    if (req.method === 'POST') {
      // Login
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ success: false, error: 'Password is required' });
      }

      // Check password
      if (password !== EVERSMILE_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Invalid password' });
      }

      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userId = 'eversmile_user';
      const expiresAt = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)); // 1 year from now

      // Save session to database
      const sessionDoc = new Session({
        sessionId,
        userId,
        isAuthenticated: true,
        expiresAt
      });
      await sessionDoc.save();

      // Set session data
      session.isAuthenticated = true;
      session.userId = userId;
      session.sessionId = sessionId;
      await session.save();

      res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        user: { userId }
      });

    } else if (req.method === 'GET') {
      // Check authentication status
      if (session.isAuthenticated && session.sessionId) {
        // Verify session exists in database and is not expired
        const sessionDoc = await Session.findOne({
          sessionId: session.sessionId,
          isAuthenticated: true,
          expiresAt: { $gt: new Date() }
        });

        if (sessionDoc) {
          res.status(200).json({ 
            success: true, 
            isAuthenticated: true,
            user: { userId: session.userId }
          });
        } else {
          // Session expired or invalid, clear it
          session.isAuthenticated = false;
          session.userId = null;
          session.sessionId = null;
          await session.save();
          
          res.status(200).json({ 
            success: true, 
            isAuthenticated: false 
          });
        }
      } else {
        res.status(200).json({ 
          success: true, 
          isAuthenticated: false 
        });
      }

    } else if (req.method === 'DELETE') {
      // Logout
      if (session.sessionId) {
        // Remove session from database
        await Session.deleteOne({ sessionId: session.sessionId });
      }

      // Clear session
      session.isAuthenticated = false;
      session.userId = null;
      session.sessionId = null;
      await session.save();

      res.status(200).json({ 
        success: true, 
        message: 'Logout successful' 
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
}

import { getIronSession } from 'iron-session';

// Session configuration
export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security',
  cookieName: 'eversmile-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds (as long as possible)
    sameSite: 'lax',
  },
};

// Get session from request and response
export function getSession(req, res) {
  return getIronSession(req, res, sessionOptions);
}

// Session data interface
export const defaultSession = {
  isAuthenticated: false,
  userId: null,
};

import mongoose from 'mongoose';

// Session Schema for authentication
const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Use existing model if it exists, otherwise create new one
const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;

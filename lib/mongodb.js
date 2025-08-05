import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Visit Schema
const visitSchema = new mongoose.Schema({
  visitDate: {
    type: Date,
    required: function() {
      return this.status === 'saved';
    },
    default: Date.now
  },
  practiceName: {
    type: String,
    required: function() {
      return this.status === 'saved';
    }
  },
  phone: {
    type: String,
    required: function() {
      return this.status === 'saved';
    }
  },
  email: {
    type: String,
    required: function() {
      return this.status === 'saved';
    }
  },
  address: {
    type: String,
    required: function() {
      return this.status === 'saved';
    }
  },
  samplesProvided: [{
    name: {
      type: String,
      enum: ['None', 'AlignerFresh Mint', 'AlignerFresh Flavors', 'AllClean Minerals', 'IPR Glide', 'Other']
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  otherSample: {
    type: String
  },
  topicsDiscussed: {
    type: String,
    required: function() {
      return this.status === 'saved'; // Only required for saved visits
    }
  },
  creditCard: {
    number: String,
    expiryMonth: String,
    expiryYear: String,
    cvv: String,
    name: String
  },
  status: {
    type: String,
    enum: ['draft', 'saved'],
    default: 'saved'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Use existing model if it exists, otherwise create new one
const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);

export { connectToDatabase, Visit };

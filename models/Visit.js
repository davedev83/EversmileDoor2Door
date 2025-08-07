import mongoose from 'mongoose';

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
  drName: {
    type: String
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
  frontDeskName: {
    type: String
  },
  backOfficeAssistantName: {
    type: String
  },
  officeManagerName: {
    type: String
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
  // Survey fields
  survey: {
    knewAboutProducts: {
      type: Boolean,
      default: null
    },
    soldProductsBefore: {
      type: Boolean,
      default: null
    },
    interestedInAlignerFresh: {
      type: Boolean,
      default: null
    },
    gaveIPRGlideSample: {
      type: Boolean,
      default: null
    },
    spokeToDoctor: {
      type: Boolean,
      default: null
    },
    showedSmartIPRVideo: {
      type: Boolean,
      default: null
    },
    quotedPrices: {
      type: Boolean,
      default: null
    },
    quotedPricesDetails: {
      type: String
    },
    readyToOrder: {
      type: Boolean,
      default: null
    },
    readyToOrderDetails: {
      type: String
    },
    officeDescription: {
      type: String
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

export default Visit;

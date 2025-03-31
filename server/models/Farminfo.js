const mongoose = require('mongoose');

const FarminfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true,
    maxlength: 2
  },
  zip: {
    type: String,
    trim: true
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  category: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'farminfo' // This ensures it connects to your existing collection
});

module.exports = mongoose.model('Farminfo', FarminfoSchema); 
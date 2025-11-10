import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code'],
    },
    country: {
      type: String,
      default: 'USA',
    },
    propertyType: {
      type: String,
      required: [true, 'Please add a property type'],
      enum: ['apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial'],
    },
    listingType: {
      type: String,
      required: [true, 'Please add a listing type'],
      enum: ['sale', 'rent', 'lease'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please add number of bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please add number of bathrooms'],
    },
    area: {
      type: Number,
      required: [true, 'Please add area in square feet'],
    },
    yearBuilt: {
      type: Number,
    },
    images: [{
      type: String,
    }],
    amenities: [{
      type: String,
    }],
    features: [{
      type: String,
    }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'sold', 'rented'],
      default: 'available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
propertySchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Property', propertySchema);
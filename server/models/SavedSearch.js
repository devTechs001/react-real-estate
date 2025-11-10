import mongoose from 'mongoose';

const savedSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    criteria: {
      propertyType: String,
      listingType: String,
      location: String,
      city: String,
      minPrice: Number,
      maxPrice: Number,
      bedrooms: Number,
      bathrooms: Number,
      amenities: [String],
    },
    emailAlerts: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily',
    },
    lastNotified: {
      type: Date,
    },
    matchCount: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

savedSearchSchema.index({ user: 1, active: 1 });

export default mongoose.model('SavedSearch', savedSearchSchema);
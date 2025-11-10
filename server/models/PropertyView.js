import mongoose from 'mongoose';

const propertyViewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    duration: {
      type: Number, // in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Index for analytics
propertyViewSchema.index({ property: 1, createdAt: -1 });
propertyViewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('PropertyView', propertyViewSchema);
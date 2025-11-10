import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: ['basic', 'pro', 'premium'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'past_due'],
      default: 'active',
    },
    price: {
      type: Number,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    stripeSubscriptionId: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    features: {
      maxListings: Number,
      featuredListings: Number,
      analytics: Boolean,
      prioritySupport: Boolean,
      aiFeatures: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ user: 1, status: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    referrerType: {
      type: String,
      enum: ['property', 'seller', 'generic'],
      default: 'generic',
    },
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    uniqueCode: {
      type: String,
      unique: true,
      required: true,
    },
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
    clickedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
      },
    ],
    conversionDetails: {
      inquiriesGenerated: { type: Number, default: 0 },
      appointmentsBooked: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Referral', referralSchema);

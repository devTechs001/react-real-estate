import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    contactMethod: {
      type: String,
      enum: ['email', 'phone', 'message'],
      default: 'email',
    },
    phone: {
      type: String,
    },
    preferredTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'closed'],
      default: 'pending',
    },
    response: {
      type: String,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
inquirySchema.index({ client: 1, createdAt: -1 });
inquirySchema.index({ seller: 1, status: 1 });
inquirySchema.index({ property: 1 });

export default mongoose.model('Inquiry', inquirySchema);
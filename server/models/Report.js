import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Property', 'User', 'Review'],
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'spam',
        'fraud',
        'inappropriate',
        'misleading',
        'duplicate',
        'other',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'resolved', 'rejected'],
      default: 'pending',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolution: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Report', reportSchema);
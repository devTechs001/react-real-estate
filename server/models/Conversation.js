import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'blocked'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure participants are unique
conversationSchema.index({ participants: 1 });

export default mongoose.model('Conversation', conversationSchema);
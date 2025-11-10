import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // minutes
    },
    type: {
      type: String,
      enum: ['viewing', 'virtual_tour', 'consultation'],
      default: 'viewing',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
    clientNotes: {
      type: String,
    },
    sellerNotes: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
appointmentSchema.index({ client: 1, appointmentDate: 1 });
appointmentSchema.index({ seller: 1, status: 1 });
appointmentSchema.index({ property: 1 });

export default mongoose.model('Appointment', appointmentSchema);
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'user_login',
        'user_logout',
        'user_register',
        'property_create',
        'property_update',
        'property_delete',
        'inquiry_create',
        'appointment_create',
        'payment_success',
        'payment_failed',
        'password_change',
        'profile_update',
      ],
    },
    resource: {
      type: String,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
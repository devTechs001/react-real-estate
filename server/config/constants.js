export const USER_ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin',
};

export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  SOLD: 'sold',
  RENTED: 'rented',
  EXPIRED: 'expired',
};

export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const INQUIRY_STATUS = {
  PENDING: 'pending',
  RESPONDED: 'responded',
  CLOSED: 'closed',
};

export const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'new_message',
  NEW_INQUIRY: 'new_inquiry',
  APPOINTMENT_REQUEST: 'appointment_request',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  PROPERTY_UPDATE: 'property_update',
  PRICE_CHANGE: 'price_change',
  NEW_REVIEW: 'new_review',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
};

export const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 5,
  },
  AI: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 100,
  },
};
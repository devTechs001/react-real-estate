import { body, param } from 'express-validator';

export const createAppointmentValidator = [
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('time')
    .notEmpty()
    .withMessage('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)'),
  body('message')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

export const updateAppointmentStatusValidator = [
  param('id')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isMongoId()
    .withMessage('Invalid appointment ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
  body('sellerNotes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Seller notes must not exceed 500 characters'),
];

export const cancelAppointmentValidator = [
  param('id')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isMongoId()
    .withMessage('Invalid appointment ID'),
  body('cancellationReason')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason must not exceed 500 characters'),
];

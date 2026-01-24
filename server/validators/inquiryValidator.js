import { body, param } from 'express-validator';

export const createInquiryValidator = [
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
];

export const respondToInquiryValidator = [
  param('id')
    .notEmpty()
    .withMessage('Inquiry ID is required')
    .isMongoId()
    .withMessage('Invalid inquiry ID'),
  body('response')
    .notEmpty()
    .withMessage('Response is required')
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Response must be between 10 and 1000 characters'),
];

export const updateInquiryStatusValidator = [
  param('id')
    .notEmpty()
    .withMessage('Inquiry ID is required')
    .isMongoId()
    .withMessage('Invalid inquiry ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'responded', 'closed'])
    .withMessage('Invalid status'),
];

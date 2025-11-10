import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Auth Validation
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  validate,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Property Validation
export const createPropertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must not exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be positive'),
  body('propertyType')
    .notEmpty()
    .withMessage('Property type is required')
    .isIn(['apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial'])
    .withMessage('Invalid property type'),
  body('listingType')
    .notEmpty()
    .withMessage('Listing type is required')
    .isIn(['sale', 'rent', 'lease'])
    .withMessage('Invalid listing type'),
  body('bedrooms')
    .notEmpty()
    .withMessage('Bedrooms is required')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms')
    .notEmpty()
    .withMessage('Bathrooms is required')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Bathrooms must be between 0 and 20'),
  body('area')
    .notEmpty()
    .withMessage('Area is required')
    .isNumeric()
    .withMessage('Area must be a number')
    .isFloat({ min: 1 })
    .withMessage('Area must be positive'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required')
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid zip code format'),
  validate,
];

export const updatePropertyValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be positive'),
  validate,
];

// Inquiry Validation
export const createInquiryValidation = [
  body('propertyId').notEmpty().withMessage('Property ID is required').isMongoId(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),
  body('contactMethod')
    .optional()
    .isIn(['email', 'phone', 'message'])
    .withMessage('Invalid contact method'),
  validate,
];

// Appointment Validation
export const createAppointmentValidation = [
  body('propertyId').notEmpty().withMessage('Property ID is required').isMongoId(),
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Appointment date must be in the future');
      }
      return true;
    }),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('type')
    .optional()
    .isIn(['viewing', 'virtual_tour', 'consultation'])
    .withMessage('Invalid appointment type'),
  validate,
];

// Review Validation
export const createReviewValidation = [
  body('property').notEmpty().withMessage('Property ID is required').isMongoId(),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),
  validate,
];

// Param Validation
export const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];

// Query Validation
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate,
];
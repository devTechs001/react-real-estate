import Joi from 'joi';

export const createPropertySchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).max(2000).required(),
  price: Joi.number().positive().required(),
  propertyType: Joi.string()
    .valid('apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial')
    .required(),
  listingType: Joi.string().valid('sale', 'rent', 'lease').required(),
  bedrooms: Joi.number().integer().min(0).max(20).required(),
  bathrooms: Joi.number().min(0).max(20).required(),
  area: Joi.number().positive().required(),
  yearBuilt: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string()
    .pattern(/^\d{5}(-\d{4})?$/)
    .required(),
  country: Joi.string().default('USA'),
  amenities: Joi.array().items(Joi.string()).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().min(5).max(100).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  price: Joi.number().positive().optional(),
  status: Joi.string()
    .valid('available', 'pending', 'sold', 'rented')
    .optional(),
  propertyType: Joi.string()
    .valid('apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial')
    .optional(),
  listingType: Joi.string().valid('sale', 'rent', 'lease').optional(),
  bedrooms: Joi.number().integer().min(0).max(20).optional(),
  bathrooms: Joi.number().min(0).max(20).optional(),
  area: Joi.number().positive().optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  featured: Joi.boolean().optional(),
});

export const propertyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  type: Joi.string().optional(),
  listingType: Joi.string().optional(),
  minPrice: Joi.number().optional(),
  maxPrice: Joi.number().optional(),
  bedrooms: Joi.number().integer().optional(),
  bathrooms: Joi.number().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  sort: Joi.string().optional(),
});

export const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    req.validatedData = value;
    next();
  };
};
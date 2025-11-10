import Property from '../models/Property.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      featured,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (type) query.propertyType = type;
    if (listingType) query.listingType = listingType;
    if (city) query.city = new RegExp(city, 'i');
    if (featured) query.featured = featured === 'true';
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Property.countDocuments(query);

    res.json({
      properties,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    const images = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'real-estate/properties',
        });
        images.push(result.secure_url);
      }
    }

    const property = await Property.create({
      ...req.body,
      images,
      owner: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user properties
// @route   GET /api/properties/user/my-properties
// @access  Private
export const getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort('-createdAt');
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
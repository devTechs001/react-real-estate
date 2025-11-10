import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/emailService.js';
import { io } from '../server.js';

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Private
export const createInquiry = async (req, res) => {
  try {
    const { propertyId, subject, message, contactMethod, phone, preferredTime } = req.body;

    const property = await Property.findById(propertyId).populate('owner');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      client: req.user._id,
      seller: property.owner._id,
      subject,
      message,
      contactMethod,
      phone,
      preferredTime,
    });

    // Create notification
    await Notification.create({
      recipient: property.owner._id,
      sender: req.user._id,
      type: 'new_inquiry',
      title: 'New Property Inquiry',
      message: `${req.user.name} sent an inquiry about ${property.title}`,
      link: `/seller/inquiries/${inquiry._id}`,
      data: { inquiryId: inquiry._id, propertyId },
    });

    // Send email
    await sendEmail({
      to: property.owner.email,
      subject: `New Inquiry: ${property.title}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>From:</strong> ${req.user.name}</p>
        <p><strong>Property:</strong> ${property.title}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Preferred Contact:</strong> ${contactMethod}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <a href="${process.env.CLIENT_URL}/seller/inquiries/${inquiry._id}">View Inquiry</a>
      `,
    });

    // Socket notification
    io.to(property.owner._id.toString()).emit('new_inquiry', {
      inquiry,
      property,
    });

    await inquiry.populate('property', 'title images price');
    
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user inquiries (client)
// @route   GET /api/inquiries/my-inquiries
// @access  Private
export const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ client: req.user._id })
      .populate('property', 'title images price location')
      .populate('seller', 'name email phone')
      .sort('-createdAt');

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get received inquiries (seller)
// @route   GET /api/inquiries/received
// @access  Private
export const getReceivedInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { seller: req.user._id };
    
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title images price location')
      .populate('client', 'name email phone')
      .sort('-createdAt');

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to inquiry
// @route   PUT /api/inquiries/:id/respond
// @access  Private
export const respondToInquiry = async (req, res) => {
  try {
    const { response } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate('client property');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (inquiry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    inquiry.response = response;
    inquiry.status = 'responded';
    inquiry.respondedAt = new Date();
    await inquiry.save();

    // Create notification
    await Notification.create({
      recipient: inquiry.client._id,
      sender: req.user._id,
      type: 'inquiry_response',
      title: 'Inquiry Response Received',
      message: `You received a response for your inquiry about ${inquiry.property.title}`,
      link: `/client/inquiries/${inquiry._id}`,
    });

    // Send email
    await sendEmail({
      to: inquiry.client.email,
      subject: `Response to Your Inquiry: ${inquiry.property.title}`,
      html: `
        <h2>Response to Your Inquiry</h2>
        <p><strong>Property:</strong> ${inquiry.property.title}</p>
        <p><strong>Your Message:</strong> ${inquiry.message}</p>
        <p><strong>Response:</strong> ${response}</p>
        <a href="${process.env.CLIENT_URL}/client/inquiries/${inquiry._id}">View Inquiry</a>
      `,
    });

    // Socket notification
    io.to(inquiry.client._id.toString()).emit('inquiry_response', inquiry);

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (
      inquiry.seller.toString() !== req.user._id.toString() &&
      inquiry.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
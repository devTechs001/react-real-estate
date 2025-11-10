import Appointment from '../models/Appointment.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/emailService.js';
import { io } from '../server.js';

// @desc    Request appointment
// @route   POST /api/appointments
// @access  Private
export const requestAppointment = async (req, res) => {
  try {
    const { propertyId, appointmentDate, appointmentTime, type, notes } = req.body;

    const property = await Property.findById(propertyId).populate('owner');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const appointment = await Appointment.create({
      property: propertyId,
      client: req.user._id,
      seller: property.owner._id,
      appointmentDate,
      appointmentTime,
      type,
      clientNotes: notes,
    });

    // Create notification
    await Notification.create({
      recipient: property.owner._id,
      sender: req.user._id,
      type: 'appointment_request',
      title: 'New Appointment Request',
      message: `${req.user.name} requested an appointment for ${property.title}`,
      link: `/seller/appointments/${appointment._id}`,
    });

    // Send email
    await sendEmail({
      to: property.owner.email,
      subject: `Appointment Request: ${property.title}`,
      html: `
        <h2>New Appointment Request</h2>
        <p><strong>Property:</strong> ${property.title}</p>
        <p><strong>Client:</strong> ${req.user.name}</p>
        <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
        <p><strong>Type:</strong> ${type}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <a href="${process.env.CLIENT_URL}/seller/appointments/${appointment._id}">View Details</a>
      `,
    });

    // Socket notification
    io.to(property.owner._id.toString()).emit('new_appointment', appointment);

    await appointment.populate('property', 'title images price location');
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my appointments (client)
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { client: req.user._id };
    
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('property', 'title images price location address')
      .populate('seller', 'name email phone')
      .sort('appointmentDate');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get received appointments (seller)
// @route   GET /api/appointments/received
// @access  Private
export const getReceivedAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { seller: req.user._id };
    
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('property', 'title images price location address')
      .populate('client', 'name email phone')
      .sort('appointmentDate');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, sellerNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('client property');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    if (sellerNotes) appointment.sellerNotes = sellerNotes;
    await appointment.save();

    // Create notification
    const notificationMessages = {
      confirmed: 'Your appointment has been confirmed',
      cancelled: 'Your appointment has been cancelled',
      completed: 'Your appointment has been completed',
    };

    await Notification.create({
      recipient: appointment.client._id,
      sender: req.user._id,
      type: `appointment_${status}`,
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `${notificationMessages[status]} for ${appointment.property.title}`,
      link: `/client/appointments/${appointment._id}`,
    });

    // Send email
    await sendEmail({
      to: appointment.client.email,
      subject: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <h2>Appointment Update</h2>
        <p><strong>Property:</strong> ${appointment.property.title}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
        ${sellerNotes ? `<p><strong>Notes:</strong> ${sellerNotes}</p>` : ''}
      `,
    });

    // Socket notification
    io.to(appointment.client._id.toString()).emit('appointment_updated', appointment);

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('client seller property');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (
      appointment.client.toString() !== req.user._id.toString() &&
      appointment.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    const recipient = appointment.client._id.toString() === req.user._id.toString()
      ? appointment.seller
      : appointment.client;

    // Notify the other party
    await Notification.create({
      recipient: recipient._id,
      sender: req.user._id,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `An appointment for ${appointment.property.title} has been cancelled`,
      link: `/appointments/${appointment._id}`,
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
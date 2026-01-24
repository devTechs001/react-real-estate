import Notification from '../models/Notification.js';
import { io } from '../server.js';

/**
 * Create and send notification
 * @param {object} notificationData - Notification data
 * @returns {Promise<object>} Created notification
 */
export const createNotification = async ({ user, type, title, message, link, data }) => {
  try {
    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      link,
      data,
    });

    // Emit real-time notification via Socket.IO
    if (io) {
      io.to(user.toString()).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Send property inquiry notification
 */
export const sendInquiryNotification = async (inquiry) => {
  return createNotification({
    user: inquiry.property.owner,
    type: 'inquiry',
    title: 'New Property Inquiry',
    message: `You have a new inquiry for ${inquiry.property.title}`,
    link: `/seller/inquiries/${inquiry._id}`,
    data: { inquiryId: inquiry._id, propertyId: inquiry.property._id },
  });
};

/**
 * Send appointment notification
 */
export const sendAppointmentNotification = async (appointment, action = 'created') => {
  const messages = {
    created: 'New appointment request',
    confirmed: 'Your appointment has been confirmed',
    cancelled: 'Your appointment has been cancelled',
    completed: 'Your appointment has been completed',
  };

  const recipients = action === 'created'
    ? [appointment.property.owner]
    : [appointment.user];

  const notifications = recipients.map((user) =>
    createNotification({
      user,
      type: 'appointment',
      title: 'Appointment Update',
      message: `${messages[action]} for ${appointment.property.title}`,
      link: `/appointments/${appointment._id}`,
      data: { appointmentId: appointment._id, propertyId: appointment.property._id },
    })
  );

  return Promise.all(notifications);
};

/**
 * Send property status notification
 */
export const sendPropertyStatusNotification = async (property, status) => {
  const messages = {
    approved: 'Your property listing has been approved',
    rejected: 'Your property listing has been rejected',
    sold: 'Your property has been marked as sold',
    rented: 'Your property has been marked as rented',
  };

  return createNotification({
    user: property.owner,
    type: 'property',
    title: 'Property Status Update',
    message: messages[status] || `Property status updated to ${status}`,
    link: `/properties/${property._id}`,
    data: { propertyId: property._id, status },
  });
};

/**
 * Send message notification
 */
export const sendMessageNotification = async (message) => {
  return createNotification({
    user: message.recipient,
    type: 'message',
    title: 'New Message',
    message: `You have a new message from ${message.sender.name}`,
    link: `/messages/${message.conversation}`,
    data: { messageId: message._id, conversationId: message.conversation },
  });
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );
  } catch (error) {
    console.error('Mark all as read error:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId, userId) => {
  try {
    await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
};

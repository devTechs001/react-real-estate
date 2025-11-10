import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import { sendEmail } from '../utils/emailService.js';

// Send appointment reminders (runs every hour)
export const appointmentReminders = cron.schedule('0 * * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: tomorrow,
        $lt: dayAfter,
      },
      status: 'confirmed',
      reminderSent: false,
    })
      .populate('client', 'name email')
      .populate('seller', 'name email')
      .populate('property', 'title address');

    for (const appointment of appointments) {
      // Send reminder to client
      await sendEmail({
        to: appointment.client.email,
        subject: 'Appointment Reminder',
        template: 'appointmentReminder',
        data: {
          name: appointment.client.name,
          propertyTitle: appointment.property.title,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          address: appointment.property.address,
        },
      });

      // Send reminder to seller
      await sendEmail({
        to: appointment.seller.email,
        subject: 'Appointment Reminder',
        template: 'appointmentReminder',
        data: {
          name: appointment.seller.name,
          propertyTitle: appointment.property.title,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          clientName: appointment.client.name,
        },
      });

      appointment.reminderSent = true;
      await appointment.save();
    }

    console.log(`Sent ${appointments.length} appointment reminders`);
  } catch (error) {
    console.error('Appointment reminder job error:', error);
  }
});
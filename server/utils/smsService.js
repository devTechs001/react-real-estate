import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log('SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('SMS Error:', error);
    throw error;
  }
};

export const sendAppointmentReminder = async (appointment, user) => {
  const message = `Reminder: You have a property viewing appointment tomorrow at ${appointment.appointmentTime} for ${appointment.property.title}. See you there!`;
  
  if (user.phone) {
    await sendSMS(user.phone, message);
  }
};

export const sendInquiryNotification = async (inquiry, seller) => {
  const message = `New inquiry received for your property: ${inquiry.property.title}. Check your dashboard for details.`;
  
  if (seller.phone && seller.smsNotifications) {
    await sendSMS(seller.phone, message);
  }
};
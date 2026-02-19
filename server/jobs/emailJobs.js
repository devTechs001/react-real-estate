import Bull from 'bull';
import { sendEmail } from '../utils/emailService.js';

let emailQueue;

try {
  emailQueue = new Bull('email', process.env.REDIS_URL || 'redis://localhost:6379');

  emailQueue.on('error', (err) => {
    // Silently handle queue errors when Redis is unavailable
  });

  emailQueue.on('waiting', () => {
    // Queue is waiting for more jobs
  });
} catch (error) {
  console.warn('⚠️ Email queue not available (Redis required)');
}

emailQueue?.process(async (job) => {
  const { to, subject, template, data } = job.data;

  try {
    await sendEmail({ to, subject, template, data });
    return { success: true };
  } catch (error) {
    console.error('Email job failed:', error);
    throw error;
  }
});

export const addEmailToQueue = (emailData) => {
  if (!emailQueue) {
    console.warn('Email queue not available, sending email synchronously');
    // Fallback: send email immediately
    return sendEmail(emailData);
  }
  return emailQueue.add(emailData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

export default emailQueue;
import Bull from 'bull';
import { sendEmail } from '../utils/emailService.js';

const emailQueue = new Bull('email', process.env.REDIS_URL);

emailQueue.process(async (job) => {
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
  return emailQueue.add(emailData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

export default emailQueue;
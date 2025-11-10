import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

export const createTransporter = () => {
  return nodemailer.createTransporter(emailConfig);
};

export const emailTemplates = {
  verification: (name, verificationLink) => ({
    subject: 'Verify Your Email',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  }),
  
  passwordReset: (name, resetLink) => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Hi ${name},</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  }),
  
  welcome: (name) => ({
    subject: 'Welcome to Real Estate Platform',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining Real Estate Platform. We're excited to have you!</p>
      <p>Start exploring properties and find your dream home today.</p>
    `,
  }),
};
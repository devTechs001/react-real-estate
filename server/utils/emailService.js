import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getTemplate = async (templateName) => {
  const templatePath = path.join(process.cwd(), 'templates', 'email', `${templateName}.hbs`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  return handlebars.compile(templateContent);
};

export const sendEmail = async ({ to, subject, html, template, data }) => {
  try {
    let emailHtml = html;

    if (template) {
      const compiledTemplate = await getTemplate(template);
      emailHtml = compiledTemplate(data);
    }

    const info = await transporter.sendMail({
      from: `"Real Estate Platform" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: emailHtml,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Real Estate Platform',
    template: 'welcome',
    data: {
      name: user.name,
      loginUrl: `${process.env.CLIENT_URL}/login`,
    },
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'resetPassword',
    data: {
      name: user.name,
      resetUrl: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
      expiryTime: '1 hour',
    },
  });
};

export const sendInquiryNotification = async (inquiry, property, seller) => {
  return sendEmail({
    to: seller.email,
    subject: `New Inquiry: ${property.title}`,
    template: 'inquiry',
    data: {
      sellerName: seller.name,
      clientName: inquiry.client.name,
      propertyTitle: property.title,
      message: inquiry.message,
      viewUrl: `${process.env.CLIENT_URL}/seller/inquiries/${inquiry._id}`,
    },
  });
};

export const sendAppointmentNotification = async (appointment, property, seller) => {
  return sendEmail({
    to: seller.email,
    subject: `New Appointment Request: ${property.title}`,
    template: 'appointment',
    data: {
      sellerName: seller.name,
      clientName: appointment.client.name,
      propertyTitle: property.title,
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
      viewUrl: `${process.env.CLIENT_URL}/seller/appointments/${appointment._id}`,
    },
  });
};
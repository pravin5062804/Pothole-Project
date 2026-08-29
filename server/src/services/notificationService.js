import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

// Initialize Nodemailer transporter
if (ENV.SMTP_USER && ENV.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: Number(ENV.SMTP_PORT),
    secure: Number(ENV.SMTP_PORT) === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });
  console.log('[Nodemailer] SMTP Transporter configured.');
} else {
  console.log('[Nodemailer] SMTP credentials not provided. Notifications will log to console in dev mode.');
}

/**
 * Send email notification to citizen/reporter
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} [options.html]
 */
export const sendEmailNotification = async ({ to, subject, text, html }) => {
  if (!to) return;

  try {
    if (transporter) {
      await transporter.sendMail({
        from: ENV.EMAIL_FROM,
        to,
        subject,
        text,
        html: html || `<p>${text}</p>`,
      });
      console.log(`[Notification] Email sent to ${to}: ${subject}`);
    } else {
      console.log(`[Notification Log -> ${to}] ${subject} | ${text}`);
    }
  } catch (error) {
    console.error(`[Notification Error] Failed to send email: ${error.message}`);
  }
};

/**
 * Broadcast real-time issue updates via Socket.IO
 * @param {Object} io - Socket.IO server instance
 * @param {string} issueId
 * @param {Object} payload
 */
export const emitIssueStatusUpdate = (io, issueId, payload) => {
  if (!io) return;
  // Emit to specific issue room
  io.to(`issue_${issueId}`).emit('issue_status_updated', payload);
  // Emit to general admin room
  io.to('admin_feed').emit('admin_issue_updated', payload);
};

/**
 * Broadcast new issue reported event
 * @param {Object} io
 * @param {Object} issue
 */
export const emitNewIssueReported = (io, issue) => {
  if (!io) return;
  io.to('admin_feed').emit('new_issue_created', issue);
};

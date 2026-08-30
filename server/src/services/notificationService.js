import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

// Initialize Nodemailer transporter
const initTransporter = async () => {
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
    // Auto-create Ethereal test account for dev
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[Nodemailer] Ethereal test account created: ${testAccount.user}`);
      console.log(`[Nodemailer] Preview emails at: https://ethereal.email/login`);
    } catch (err) {
      console.log('[Nodemailer] Could not create Ethereal account. Notifications will log to console.', err.message);
    }
  }
};

initTransporter();

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
      const info = await transporter.sendMail({
        from: ENV.EMAIL_FROM,
        to,
        subject,
        text,
        html: html || `<p>${text}</p>`,
      });
      console.log(`[Notification] Email sent to ${to}: ${subject}`);
      // Log Ethereal preview URL in dev mode
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[Notification] Preview: ${previewUrl}`);
      }
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

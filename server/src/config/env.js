import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civic_reporting_db',
  JWT_SECRET: process.env.JWT_SECRET || 'civic_super_secret_jwt_key_2026_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Cloudinary
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Groq AI
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  GROQ_VISION_MODEL: process.env.GROQ_VISION_MODEL || '',

  // Nodemailer
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Civic Reports <no-reply@civicreport.org>',

  // Client URL for CORS & Sockets
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Deduplication & Cluster radius in meters
  DEDUP_RADIUS_METERS: Number(process.env.DEDUP_RADIUS_METERS) || 75,
  
  // AI Confidence threshold for auto-acceptance vs manual review
  AI_CONFIDENCE_THRESHOLD: Number(process.env.AI_CONFIDENCE_THRESHOLD) || 0.70,
};

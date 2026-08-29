import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

let isCloudinaryConfigured = false;

let cloudName = ENV.CLOUDINARY_CLOUD_NAME;
let apiKey = ENV.CLOUDINARY_API_KEY;
let apiSecret = ENV.CLOUDINARY_API_SECRET;

// If CLOUDINARY_URL is provided (e.g. cloudinary://<api_key>:<api_secret>@<cloud_name>), parse it
if (ENV.CLOUDINARY_URL) {
  const match = ENV.CLOUDINARY_URL.trim().match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (match) {
    apiKey = match[1];
    apiSecret = match[2];
    cloudName = match[3];
  }
}

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  isCloudinaryConfigured = true;
  console.log(`[Cloudinary] Configured successfully for cloud: ${cloudName}`);
} else {
  console.warn('[Cloudinary] Missing credentials. Operating in dev fallback/base64 mode.');
  if (!cloudName) console.warn('  ↳ Missing CLOUDINARY_CLOUD_NAME (e.g. gautamcloudinary)');
  if (!apiKey) console.warn('  ↳ Missing CLOUDINARY_API_KEY (15-digit numeric API key)');
  if (!apiSecret) console.warn('  ↳ Missing CLOUDINARY_API_SECRET (alphanumeric secret key)');
}

/**
 * Upload a file buffer to Cloudinary or return a dev data URI fallback
 * @param {Buffer} buffer
 * @param {string} folder
 * @param {string} mimetype
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (buffer, folder = 'civic_reports', mimetype = 'image/jpeg') => {
  if (!buffer) return null;

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Fallback for development without Cloudinary credentials
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64}`;
  return {
    url: dataUrl,
    public_id: `dev_${Date.now()}`,
  };
};

export { cloudinary, isCloudinaryConfigured };

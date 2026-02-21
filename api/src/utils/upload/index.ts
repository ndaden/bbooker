import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { sha256hash } from '../crypto';

export const AUTHORIZED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
export const MAX_FILE_SIZE = 2_000_000 // 2MB
export const MIN_FILE_SIZE = 1_000 // 1KB pour éviter fichiers vides

// Initialize R2 (S3-compatible) client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Validate R2 config
if (!process.env.CLOUDFLARE_ACCOUNT_ID || !R2_BUCKET || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
  console.error('⚠️  R2 config is missing required fields:', {
    hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
    hasBucket: !!R2_BUCKET,
    hasAccessKeyId: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    hasSecretAccessKey: !!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  });
}

// Valid extensions mapped to MIME types
const ALLOWED_EXTENSIONS: Record<string, string> = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp'
};

// File signature validation (magic numbers)
const FILE_SIGNATURES: Record<string, number[]> = {
  'jpg': [0xFF, 0xD8, 0xFF],
  'jpeg': [0xFF, 0xD8, 0xFF],
  'png': [0x89, 0x50, 0x4E, 0x47],
  'webp': [0x52, 0x49, 0x46, 0x46]
};

// Sanitize filename to prevent path traversal
const sanitizeFilename = (filename: string): string => {
  // Remove any path traversal sequences
  return filename
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[<>:"|?*]/g, '')
    .trim();
};

// Validate file by checking its signature (magic numbers)
const validateFileSignature = async (file: File, extension: string): Promise<boolean> => {
  const expectedSignature = FILE_SIGNATURES[extension.toLowerCase()];
  if (!expectedSignature) return false;
  
  const buffer = await file.slice(0, expectedSignature.length).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  return expectedSignature.every((byte, index) => bytes[index] === byte);
};

const uploadImageToR2 = async (image: File, accountId: string, filename: string): Promise<{ success: boolean, error?: string, url?: string }> => {
  // Extract and validate extension
  const originalName = image.name.toLowerCase();
  const extensionMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extensionMatch ? extensionMatch[1] : null;
  
  // Security validations
  if (!extension || !ALLOWED_EXTENSIONS[extension]) {
    return { success: false, error: "Type de fichier non autorisé. Seuls JPG, PNG et WEBP sont acceptés." }
  }
  
  // Validate MIME type matches extension
  const expectedMimeType = ALLOWED_EXTENSIONS[extension];
  if (image.type !== expectedMimeType) {
    return { success: false, error: "Le type de fichier ne correspond pas à son extension." }
  }
  
  // Validate file signature (magic numbers)
  const isValidSignature = await validateFileSignature(image, extension);
  if (!isValidSignature) {
    return { success: false, error: "Le contenu du fichier ne correspond pas à son type déclaré." }
  }
  
  if (image.size > MAX_FILE_SIZE) {
    return { success: false, error: "Fichier trop volumineux (max 2MB)." }
  }
  if (image.size < MIN_FILE_SIZE) {
    return { success: false, error: "Fichier trop petit." }
  }
  
  // Sanitize filename to prevent path traversal
  const sanitizedFilename = sanitizeFilename(filename);
  if (!sanitizedFilename) {
    return { success: false, error: "Nom de fichier invalide." }
  }
  
  const timestamp = new Date().getTime();
  const safeExtension = extension.toLowerCase();
  const objectKey = `${accountId}/${sanitizedFilename}-${timestamp}.${safeExtension}`;
  
  try {
    const buffer = await image.arrayBuffer();
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
        Body: new Uint8Array(buffer),
        ContentType: image.type,
      })
    );
    
    const url = `${R2_PUBLIC_URL}/${objectKey}`;
    return { success: true, url };
  } catch (error) {
    console.error('R2 upload error:', error);
    return { success: false, error: 'Échec du téléchargement de l\'image' };
  }
}

const deleteImageFromR2 = async (imageUrl: string): Promise<{ success: boolean, error?: string }> => {
  try {
    // Extract object key from URL
    const url = new URL(imageUrl);
    const objectKey = url.pathname.slice(1); // Remove leading slash
    
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
      })
    );
    
    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return { success: false, error: 'Échec de la suppression de l\'image' };
  }
}

export { r2Client, R2_BUCKET, R2_PUBLIC_URL, uploadImageToR2, deleteImageFromR2 }

import { initializeApp } from "firebase/app"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { sha256hash } from "../crypto";

export const AUTHORIZED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
export const MAX_FILE_SIZE = 2_000_000 // 2MB
export const MIN_FILE_SIZE = 1_000 // 1KB pour éviter fichiers vides

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
};

// Initialize Firebase and cloud storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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

const uploadImageToFirebase = async (image: File, accountId: string, filename: string): Promise<{ success: boolean, error?: string, url?: string }> => {
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
  // Use sanitized filename and validated extension
  const safeExtension = extension.toLowerCase();
  const storagePath = `${accountId}/${sanitizedFilename}-${timestamp}.${safeExtension}`;
  
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, await image.arrayBuffer());
  return { success: true, url: await getDownloadURL(snapshot.ref) };
}

export { app, storage, uploadImageToFirebase }
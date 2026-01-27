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

const uploadImageToFirebase = async (image: File, accountId: string, filename: string): Promise<{ success: boolean, error?: string, url?: string }> => {
  const extension = image.name.split('.').pop()
  
  // Validations de sécurité
  if (!AUTHORIZED_FILE_TYPES.includes(image.type)) {
    return { success: false, error: "Type de fichier non autorisé." }
  }
  if (image.size > MAX_FILE_SIZE) {
    return { success: false, error: "Fichier trop volumineux (max 2MB)." }
  }
  if (image.size < MIN_FILE_SIZE) {
    return { success: false, error: "Fichier trop petit." }
  }
  if (!extension || extension.length > 10) {
    return { success: false, error: "Extension de fichier invalide." }
  }
  
  const timestamp = new Date().getTime();

  const storageRef = ref(storage, `${accountId}/${filename}-${timestamp}.${extension}`);
  const snapshot = await uploadBytes(storageRef, await image.arrayBuffer());
  return { success: true, url: await getDownloadURL(snapshot.ref) };
}

export { app, storage, uploadImageToFirebase }
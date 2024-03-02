import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

export const AUTHORIZED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']
export const MAX_FILE_SIZE = 500_000

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

  export { app, storage }
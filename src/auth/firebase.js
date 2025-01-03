import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firestore imports
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCsydk46Exj1t5XkiAY3uxgaULq0Jipm2Q',
  authDomain: 'microverse-clone.firebaseapp.com',
  projectId: 'microverse-clone',
  storageBucket: 'microverse-clone.appspot.com',
  messagingSenderId: '322858778304',
  appId: '1:322858778304:web:0af7c42aef305ed8287725',
  measurementId: 'G-R1KM15MK6B',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { collection, addDoc };

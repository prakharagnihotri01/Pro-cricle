import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAiBKGljyVOaSaQpG3bCfLaBLJsOomDH88",
  authDomain: "pro-circle-project.firebaseapp.com",
  projectId: "pro-circle-project",
  storageBucket: "pro-circle-project.firebasestorage.app",
  messagingSenderId: "27045257870",
  appId: "1:27045257870:web:07e460566e03f23614dfdf",
  measurementId: "G-VNVM0D1CQL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// Initialize analytics only if window is defined to avoid SSR issues if any later
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

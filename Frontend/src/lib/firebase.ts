
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBbSWhxS-8S_bXKBo2krvKLLBMTXV_JYpo",
  authDomain: "ai-math-tutor-8a0b7.firebaseapp.com",
  projectId: "ai-math-tutor-8a0b7",
  storageBucket: "ai-math-tutor-8a0b7.appspot.com",
  messagingSenderId: "889171754251",
  appId: "1:889171754251:web:e31ab803afa3ab5e9bf60e"
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider for better popup handling
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export auth functions
export { signInWithPopup, signOut };

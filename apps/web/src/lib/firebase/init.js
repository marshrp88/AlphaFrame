/**
 * Firebase Initialization - PHASE 3 IMPLEMENTATION
 * 
 * Purpose: Initializes Firebase Auth and Firestore services
 * 
 * Current Status: Firebase initialization with Auth and Firestore
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import getFirebaseConfig from './config.js';

// Initialize Firebase app
const app = initializeApp(getFirebaseConfig());

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    // Connect to Auth emulator (if running)
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('Connected to Firebase Auth emulator');
  } catch (error) {
    console.log('Firebase Auth emulator not running, using production');
  }

  try {
    // Connect to Firestore emulator (if running)
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (error) {
    console.log('Firestore emulator not running, using production');
  }
}

export default app; 
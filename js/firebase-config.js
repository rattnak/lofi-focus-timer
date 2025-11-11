// ==========================================
// Firebase Configuration and Initialization
// ==========================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-credentials.js';

// Initialize Firebase
let app;
let auth;
let db;
let currentUser = null;

function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Enable offline persistence for Firestore
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log('Firebase: Offline persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firebase: Multiple tabs open, persistence enabled only in first tab');
        } else if (err.code === 'unimplemented') {
          console.warn('Firebase: Browser doesn\'t support persistence');
        }
      });

    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
}

// Sign in anonymously to get a unique user ID
async function signInUser() {
  try {
    const userCredential = await signInAnonymously(auth);
    currentUser = userCredential.user;
    console.log('Signed in anonymously with UID:', currentUser.uid);
    return currentUser.uid;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Listen for auth state changes
function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      callback(user);
    } else {
      // User is signed out, sign in again
      signInUser().then(callback);
    }
  });
}

// Get current user ID
function getUserId() {
  return currentUser ? currentUser.uid : null;
}

// Get Firestore instance
function getFirestoreDb() {
  return db;
}

// Get Auth instance
function getFirebaseAuth() {
  return auth;
}

// Export functions
export {
  initializeFirebase,
  signInUser,
  onAuthChange,
  getUserId,
  getFirestoreDb,
  getFirebaseAuth
};

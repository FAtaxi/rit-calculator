// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase-configuratie
const firebaseConfig = {
  apiKey: "AIzaSyAIpEZWCLXWgCBsMQKQVSxWc4GySJ1NlMc",
  authDomain: "fa-taxi-service.firebaseapp.com",
  projectId: "fa-taxi-service",
  storageBucket: "fa-taxi-service.firebasestorage.app",
  messagingSenderId: "482023134149",
  appId: "1:482023134149:web:db57e87f7f671ea4a8b1ac",
  measurementId: "G-CZ09KB69NR"
};

// Firebase-initialisatie
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };

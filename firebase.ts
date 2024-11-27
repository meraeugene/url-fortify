// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "url-fortify.firebaseapp.com",
  projectId: "url-fortify",
  storageBucket: "url-fortify.firebasestorage.app",
  messagingSenderId: "439626276949",
  appId: "1:439626276949:web:caec5827736636cd03b4dc",
  measurementId: "G-X8CHZDSZ2L",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

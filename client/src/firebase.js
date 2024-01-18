// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kathmanduquarters.firebaseapp.com",
  projectId: "kathmanduquarters",
  storageBucket: "kathmanduquarters.appspot.com",
  messagingSenderId: "1077071371252",
  appId: "1:1077071371252:web:6675c4a533cea5da22b7a1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

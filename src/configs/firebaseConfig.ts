// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { FirebaseApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  // apiKey: "AIzaSyBE6syZvYy_BznAmDNdRiAlgGyBNl6qnJc",
  // authDomain: "dddd-6rsi16.firebaseapp.com",
  // projectId: "dddd-6rsi16",
  // storageBucket: "dddd-6rsi16.appspot.com",
  // messagingSenderId: "680249850783",
  // appId: "1:680249850783:web:1b055a96989c80ad4a9baa"
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const functions = getFunctions(app);
connectFunctionsEmulator(functions, "127.0.0.1", 5001)

export default app

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi7ZHkDsFxcwn-vKVVZ3dzedRFLILVVdM",
  authDomain: "dashboard-142e3.firebaseapp.com",
  projectId: "dashboard-142e3",
  storageBucket: "dashboard-142e3.appspot.com",
  messagingSenderId: "811172885680",
  appId: "1:811172885680:web:e1453f4ee744779124f775",
  measurementId: "G-BWT79ELDVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
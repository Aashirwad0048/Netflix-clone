import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC44_kKfLvcVYd0YkpQnMCVPnuAnAZ7aCo",
  authDomain: "vite-react-netflix-clone.firebaseapp.com",
  projectId: "vite-react-netflix-clone",
  storageBucket: "vite-react-netflix-clone.firebasestorage.app",
  messagingSenderId: "21305098948",
  appId: "1:21305098948:web:7c62aab98c431769377f91",
  measurementId: "G-M66MWH99FS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBvAbjPBHaAqaoDQou0qj8wAt1J2h93rbQ",
  authDomain: "todowi-1cde9.firebaseapp.com",
  projectId: "todowi-1cde9",
  storageBucket: "todowi-1cde9.appspot.com",
  messagingSenderId: "461520864611",
  appId: "1:461520864611:web:c38f5f27bf5def6bfbff56",
  measurementId: "G-Z2C59S4MF4",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

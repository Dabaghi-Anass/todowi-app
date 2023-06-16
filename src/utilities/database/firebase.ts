
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBvAbjPBHaAqaoDQou0qj8wAt1J2h93rbQ",
  authDomain: "todowi-1cde9.firebaseapp.com",
  projectId: "todowi-1cde9",
  storageBucket: "todowi-1cde9.appspot.com",
  messagingSenderId: "461520864611",
  appId: "1:461520864611:web:c38f5f27bf5def6bfbff56",
  measurementId: "G-Z2C59S4MF4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
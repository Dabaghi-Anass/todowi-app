import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getMessaging, getToken, Observer } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  await Notification.requestPermission().then(async (permission) => {
    if (permission === "granted") {
      await getToken(messaging, {
        vapidKey:
          "BNzHSd47Hh2vxalI8bZrvDilQcsO5Ndq_ur4wQp74tLZTaRs2Y3nIvk0FtNLmodj5LmIjbA4wSx0oj9VHaA8_P8",
      }).then((token: string) => {
        // console.log(token);
      });
    }
  });
}

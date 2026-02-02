// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzVd3imU2aDaQuPlobHvs5GvkgZzcTVsY",
  authDomain: "daily-logs-a1442.firebaseapp.com",
  projectId: "daily-logs-a1442",
  storageBucket: "daily-logs-a1442.firebasestorage.app",
  messagingSenderId: "985919514200",
  appId: "1:985919514200:web:d7dde2f9a49bd36dda0c2d",
  measurementId: "G-12HT5FPHFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqgefuW-1IyJZJBcSx5XwKgtzMZjJ6ksk",
  authDomain: "examapp-bd6aa.firebaseapp.com",
  projectId: "examapp-bd6aa",
  storageBucket: "examapp-bd6aa.firebasestorage.app",
  messagingSenderId: "952798086641",
  appId: "1:952798086641:web:af1f50c31491107e4b3050",
  measurementId: "G-9Y04T71BZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
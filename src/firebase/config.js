import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiuqJlWagBY2DU3a1pe2htuLEW550ezxI",
  authDomain: "department-task-management.firebaseapp.com",
  projectId: "department-task-management",
  storageBucket: "department-task-management.firebasestorage.app",
  messagingSenderId: "484203030414",
  appId: "1:484203030414:web:8e679e062c79c9237666df"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGvcUqp43kDfo3j-ouGpMFRLSS7KfR1uI",
  authDomain: "money-manager-3ce25.firebaseapp.com",
  projectId: "money-manager-3ce25",
  storageBucket: "money-manager-3ce25.appspot.com",
  messagingSenderId: "297657299173",
  appId: "1:297657299173:web:e39fd078802fb11909240c"
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);
let db = getFirestore();

const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  db = getFirestore();
};

export { app, db, initializeFirebase };
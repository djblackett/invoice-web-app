// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBzHXtpWX_xSy_GwoG5nuwDjK8pWUXIZsw",
    authDomain: "invoice-app-project-51ef3.firebaseapp.com",
    projectId: "invoice-app-project-51ef3",
    storageBucket: "invoice-app-project-51ef3.appspot.com",
    messagingSenderId: "164597558125",
    appId: "1:164597558125:web:01207b83fd69af896bc864",
    measurementId: "G-0P0YYQ11QY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);

// const db = firebase.firestore();

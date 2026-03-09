// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD5f45zQ8ztFCH3KJAREsHfu0BxkaLw6DY",
    authDomain: "mailmerge-pro-ai.firebaseapp.com",
    projectId: "mailmerge-pro-ai",
    storageBucket: "mailmerge-pro-ai.firebasestorage.app",
    messagingSenderId: "110951446021",
    appId: "1:110951446021:web:5cc6d17675f8c03627ce6c",
    measurementId: "G-XM3M0PVWTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
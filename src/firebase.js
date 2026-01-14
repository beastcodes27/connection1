import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC03mFNASsFQ4357OHwEPPPX1nGPCVr39o",
    authDomain: "connection1-76fb4.firebaseapp.com",
    projectId: "connection1-76fb4",
    storageBucket: "connection1-76fb4.firebasestorage.app",
    messagingSenderId: "41315391172",
    appId: "1:41315391172:web:bf56e144984892a495db91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

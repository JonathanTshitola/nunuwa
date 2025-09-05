import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // Vos clés API Firebase ici
  apiKey: "AIzaSyAJmnoip2I5flTFv-V_5NRUYfloWshS80A",
  authDomain: "nunuwastore-33ca2.firebaseapp.com",
  projectId: "nunuwastore-33ca2",
  storageBucket: "nunuwastore-33ca2.firebasestorage.app",
  messagingSenderId: "857866399658",
  appId: "1:857866399658:web:f46ce1ae93a084844505d3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
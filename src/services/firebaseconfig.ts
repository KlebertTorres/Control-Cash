import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    getReactNativePersistence,
    initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCVDzZaLivlt8WoiJiPCn3v2p9NeunFcyk",
  authDomain: "control-cash-7cf29.firebaseapp.com",
  projectId: "control-cash-7cf29",
  storageBucket: "control-cash-7cf29.firebasestorage.app",
  messagingSenderId: "173881826475",
  appId: "1:173881826475:web:d441a04d475910ff3bebee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
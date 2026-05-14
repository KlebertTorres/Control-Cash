// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDhfmvfx6O7JKj0bmbUEYaJWzw6b-KuE5I",
  authDomain: "control-cash-7cf29.firebaseapp.com",
  projectId: "control-cash-7cf29",
  storageBucket: "control-cash-7cf29.firebasestorage.app",
  messagingSenderId: "173881826475",
  appId: "1:173881826475:web:d441a04d475910ff3bebee"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
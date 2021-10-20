import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDebABrC5Ao4yu5wiZRDR_OE9bVlzbpWLU",
    authDomain: "document-viewer-editor-e88ab.firebaseapp.com",
    projectId: "document-viewer-editor-e88ab",
    storageBucket: "document-viewer-editor-e88ab.appspot.com",
    messagingSenderId: "831948840605",
    appId: "1:831948840605:web:b6274e5f5229d4d8b03e74"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };

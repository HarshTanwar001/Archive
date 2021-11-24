import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDjojcir0Ie0Qsdm1qJ4m2FZLoi9aOpzA8",
  authDomain: "document-viewer-editor-f1379.firebaseapp.com",
  projectId: "document-viewer-editor-f1379",
  storageBucket: "document-viewer-editor-f1379.appspot.com",
  messagingSenderId: "62415916478",
  appId: "1:62415916478:web:d7bf248136a5a7a1277def"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export { app, db };

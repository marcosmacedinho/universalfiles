import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApqKDBSDpBVxU_gxXNtanM8IIJ-gREgDw",
  authDomain: "universalfiles-15c37.firebaseapp.com",
  projectId: "universalfiles-15c37",
  storageBucket: "universalfiles-15c37.appspot.com",
  messagingSenderId: "370443572910",
  appId: "1:370443572910:web:220c707a3c3d7eaaf7ff3f",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };

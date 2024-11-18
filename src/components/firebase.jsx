// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyCaXd-j2pl4olDayinOw7f9EArZuWFhF3g",
  authDomain: "level-monitoring-system.firebaseapp.com",
  databaseURL: "https://level-monitoring-system-default-rtdb.firebaseio.com",
  projectId: "level-monitoring-system",
  storageBucket: "level-monitoring-system.firebasestorage.app",
  messagingSenderId: "1049078248138",
  appId: "1:1049078248138:web:5b6a575a84ea3cd1a4fa33",
  measurementId: "G-84FQCQ0QG0"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
export { app, database, auth };
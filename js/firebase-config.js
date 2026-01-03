import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-5JP7gDCofoYyXv2rCVJDYBTL4Ydqmt0",
  authDomain: "xpress-chatv1.firebaseapp.com",
  projectId: "xpress-chatv1",
  storageBucket: "xpress-chatv1.firebasestorage.app",
  messagingSenderId: "118218510976",
  appId: "1:118218510976:web:4ab217a909285f52828c65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Make firebase object available globally for compatibility
window.firebase = { firestore: { FieldValue: { serverTimestamp: () => ({}) } } };

export { auth, db };

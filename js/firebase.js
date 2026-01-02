import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, remove, runTransaction }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA60ZFublVIZyAZnIFLM-nUQmDd4l-84ko",
  authDomain: "xpress-chat-b2269.firebaseapp.com",
  // 🔥 FIXED: This must be the database endpoint, not the console link
  databaseURL: "https://xpress-chat-b2269-default-rtdb.firebaseio.com", 
  projectId: "xpress-chat-b2269",
  storageBucket: "xpress-chat-b2269.firebasestorage.app",
  messagingSenderId: "734261007530",
  appId: "1:734261007530:web:1d5dc5b9c8ca16dd5bacd3",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db, ref, push, onChildAdded, onValue,
  set, remove, runTransaction,
  auth, RecaptchaVerifier, signInWithPhoneNumber
};

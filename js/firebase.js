import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, remove }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA60ZFublVIZyAZnIFLM-nUQmDd4l-84ko",
  authDomain: "xpress-chat-b2269.firebaseapp.com",
  databaseURL: "https://xpress-chat-b2269-default-rtdb.firebaseio.com",
  projectId: "xpress-chat-b2269",
  storageBucket: "xpress-chat-b2269.firebasestorage.app",
  messagingSenderId: "734261007530",
  appId: "1:734261007530:web:1d5dc5b9c8ca16dd5bacd3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db, ref, push, onChildAdded, onValue, set, remove,
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut
};

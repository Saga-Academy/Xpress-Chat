import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, remove, runTransaction }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db, ref, push, onChildAdded, onValue,
  set, remove, runTransaction,
  auth, RecaptchaVerifier, signInWithPhoneNumber
};

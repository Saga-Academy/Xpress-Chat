import { auth, db, ref, set, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase.js";

window.handleSignUp = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const avatar = document.getElementById("avatar").value || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(res => saveSession(res.user, email, avatar))
    .catch(err => alert(err.message));
};

window.handleLogin = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(res => {
      const avatar = localStorage.getItem("avatar") || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`;
      saveSession(res.user, email, avatar);
    })
    .catch(err => alert(err.message));
};

function saveSession(user, email, avatar) {
  localStorage.setItem("uid", user.uid);
  localStorage.setItem("user", email);
  localStorage.setItem("avatar", avatar);
  set(ref(db, "users/" + user.uid), { email, avatar, online: true });
  location.href = "index.html";
}

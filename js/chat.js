import { db, ref, push, onChildAdded } from "./firebase.js";

const user = localStorage.getItem("user");
const avatar = localStorage.getItem("avatar");
const room = localStorage.getItem("room") || "Coruscant-Main";
document.getElementById("roomName").innerText = room;

const msgRef = ref(db, "rooms/" + room);
const box = document.getElementById("messages");
const input = document.getElementById("msg");

window.send = () => {
  if (!input.value) return;
  push(msgRef, {
    user,
    avatar,
    text: input.value,
    time: Date.now()
  });
  input.value = "";
};

onChildAdded(msgRef, s => {
  const m = s.val();
  const d = document.createElement("div");
  d.className = "msg " + (m.user === user ? "me" : "other");
  d.innerHTML = `<img src="${m.avatar}" style="width:30px;height:30px;border-radius:50%"> <div>${m.text}</div>`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
});

window.logout = () => {
  localStorage.clear();
  window.location.href = "login.html";
};

window.switchSide = (side) => {
  const root = document.documentElement;
  if (side === 'dark') {
    root.style.setProperty('--lightsaber-color', '#ff0037');
  } else {
    root.style.setProperty('--lightsaber-color', '#00e5ff');
  }
};

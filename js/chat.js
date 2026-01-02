import { db, ref, push, onChildAdded } from "./firebase.js";

const user = localStorage.getItem("user");
const avatar = localStorage.getItem("avatar");
const room = "Coruscant-Main";
const box = document.getElementById("messages");

document.getElementById("roomName").innerText = room;

window.send = () => {
  const input = document.getElementById("msg");
  if (!input.value.trim()) return;
  push(ref(db, "rooms/" + room), { user, avatar, text: input.value, time: Date.now() });
  input.value = "";
};

onChildAdded(ref(db, "rooms/" + room), s => {
  const m = s.val();
  const d = document.createElement("div");
  d.className = "msg " + (m.user === user ? "me" : "other");
  d.innerHTML = `<img src="${m.avatar}" style="width:30px;height:30px;border-radius:50%"> <div><b>${m.user.split('@')[0]}</b><br>${m.text}</div>`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
});

window.logout = () => { localStorage.clear(); location.href = "login.html"; };

window.switchSide = (side) => {
  const root = document.documentElement;
  root.style.setProperty('--lightsaber-color', side === 'dark' ? '#ff0037' : '#00e5ff');
};

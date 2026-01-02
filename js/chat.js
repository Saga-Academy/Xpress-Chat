import { db, ref, push, onChildAdded, runTransaction } from "./firebase.js";

const user = localStorage.getItem("user");
const avatar = localStorage.getItem("avatar");
const room = localStorage.getItem("room") || "general";
document.getElementById("roomName").innerText = room;

const msgRef = ref(db, "rooms/" + room);
const box = document.getElementById("messages");
const input = document.getElementById("msg");
const replyBox = document.getElementById("replyBox");
const replyText = document.getElementById("replyText");

let replyTo = null;

window.send = () => {
  if (!input.value) return;
  push(msgRef, {
    user,
    avatar,
    text: input.value,
    replyTo,
    time: Date.now()
  });
  replyTo = null;
  replyBox.hidden = true;
  input.value = "";
};

onChildAdded(msgRef, s => {
  const m = s.val(), id = s.key;
  const d = document.createElement("div");
  d.className = "msg " + (m.user === user ? "me" : "other");
  d.innerHTML = `
    <img src="${m.avatar}">
    <div>
      ${m.replyTo ? "<small>Signal Intercepted</small><br>" : ""}
      ${m.text}
      <div class="reactions"></div>
    </div>`;
  
  if (m.reactions) {
    for (let e in m.reactions) {
      d.querySelector(".reactions").innerHTML += `<span>${e} ${m.reactions[e]}</span>`;
    }
  }
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
});

window.switchSide = (side) => {
  const root = document.documentElement;
  if (side === 'dark') {
    root.style.setProperty('--lightsaber-color', '#ff0037'); // Sith Red
  } else {
    root.style.setProperty('--lightsaber-color', '#00e5ff'); // Jedi Cyan
  }
};

window.cancelReply = () => replyBox.hidden = true;

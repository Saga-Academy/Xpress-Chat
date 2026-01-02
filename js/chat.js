import { db, ref, push, onChildAdded } from "./firebase.js";

// 🔐 Security Guard: Block unauthorized access immediately
const user = localStorage.getItem("user");
const avatar = localStorage.getItem("avatar");
const uid = localStorage.getItem("uid");

if (!uid || !user) {
    window.location.href = "login.html";
}

// 🪐 Room Initialization
const room = localStorage.getItem("room") || "Coruscant-Main";
const roomDisplay = document.getElementById("roomName");
if (roomDisplay) roomDisplay.innerText = room;

const msgRef = ref(db, "rooms/" + room);
const box = document.getElementById("messages");
const input = document.getElementById("msg");

// 🚀 Send Transmission
window.send = () => {
    if (!input.value.trim()) return;
    
    push(msgRef, {
        user,
        avatar,
        text: input.value,
        time: Date.now()
    });
    
    input.value = "";
    input.focus();
};

// 📥 Receive Signals (Real-time)
onChildAdded(msgRef, (snapshot) => {
    const data = snapshot.val();
    const messageDiv = document.createElement("div");
    
    // Check if the message is from current user
    const isMe = data.user === user;
    messageDiv.className = `msg ${isMe ? 'me' : 'other'}`;
    
    messageDiv.innerHTML = `
        <img src="${data.avatar}" alt="pilot" style="width:35px; height:35px; border-radius:50%;">
        <div class="bubble">
            <small style="display:block; font-size:10px; opacity:0.7;">${data.user.slice(-4)}</small>
            ${data.text}
        </div>
    `;
    
    box.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    box.scrollTop = box.scrollHeight;
});

// 🚪 Abandon Post (Logout)
window.logout = () => {
    localStorage.clear();
    window.location.href = "login.html";
};

// ⚔️ Choose Your Side (Theme Switcher)
window.switchSide = (side) => {
    const root = document.documentElement;
    if (side === 'dark') {
        root.style.setProperty('--lightsaber-color', '#ff0037'); // Sith Red
        root.style.setProperty('--death-star-panel', '#121212');
    } else {
        root.style.setProperty('--lightsaber-color', '#00e5ff'); // Jedi Cyan
        root.style.setProperty('--death-star-panel', '#1a1a1a');
    }
};

// 📡 Register Service Worker for Galactic Notifications
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./firebase-messaging-sw.js')
            .then(reg => console.log('Comm-Link SW Registered'))
            .catch(err => console.log('SW Registration Failed', err));
    });
}

// 📱 Handle Enter Key for Mobile
input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        window.send();
    }
});

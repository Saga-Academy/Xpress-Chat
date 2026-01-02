// 🔥 Firebase Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialize Firebase in the Service Worker with your project credentials
firebase.initializeApp({
  apiKey: "AIzaSyA60ZFublVIZyAZnIFLM-nUQmDd4l-84ko",
  projectId: "xpress-chat-b2269",
  messagingSenderId: "734261007530",
  appId: "1:734261007530:web:1d5dc5b9c8ca16dd5bacd3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Background Message received: ', payload);

  const notificationTitle = payload.notification.title || "New Galactic Signal";
  const notificationOptions = {
    body: payload.notification.body || "A new transmission has been intercepted.",
    icon: "https://saga-academy.github.io/Xpress-Chat/icon.png", // Ensure this path is correct
    badge: "https://saga-academy.github.io/Xpress-Chat/badge.png",
    tag: "chat-msg",
    renotify: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

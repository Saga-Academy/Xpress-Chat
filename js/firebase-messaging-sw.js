importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA60ZFublVIZyAZnIFLM-nUQmDd4l-84ko",
  projectId: "xpress-chat-b2269",
  messagingSenderId: "734261007530",
  appId: "1:734261007530:web:1d5dc5b9c8ca16dd5bacd3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png"
  });
});

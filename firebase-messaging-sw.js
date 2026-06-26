importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLyFbQ5GpMYWYvCw2fSq7eAMkxo0X1nwE",
  authDomain: "secret-mailbox-a73ab.firebaseapp.com",
  databaseURL: "https://secret-mailbox-a73ab-default-rtdb.firebaseio.com",
  projectId: "secret-mailbox-a73ab",
  storageBucket: "secret-mailbox-a73ab.firebasestorage.app",
  messagingSenderId: "693523872316",
  appId: "1:693523872316:web:1e9dfc503983b377876139"
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var title = (payload.notification && payload.notification.title) || "صندوق البريد";
  var options = {
    body: (payload.notification && payload.notification.body) || "وصلتك رسالة جديدة",
    icon: "/postman-logo.png"
  };
  self.registration.showNotification(title, options);
});

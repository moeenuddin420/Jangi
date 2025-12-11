importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyAafXkJwyZ5F7Xuax0VktZ9cpqWD4oCvxU",
    authDomain: "tournament-97743.firebaseapp.com",
    projectId: "tournament-97743",
    messagingSenderId: "584797187828",
    appId: "1:584797187828:web:4c643f83dfd9b700adb8a1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Required for Chrome to detect PWA "Installability"
self.addEventListener('fetch', (event) => {
  return; 
});
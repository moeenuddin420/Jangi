importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 1. Initialize Firebase (Must match your HTML config)
firebase.initializeApp({
    apiKey: "AIzaSyAafXkJwyZ5F7Xuax0VktZ9cpqWD4oCvxU",
    authDomain: "tournament-97743.firebaseapp.com",
    projectId: "tournament-97743",
    messagingSenderId: "584797187828",
    appId: "1:584797187828:web:4c643f83dfd9b700adb8a1"
});

// 2. Handle Background Notifications
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/11482/11482650.png', // Your Demon Icon
        badge: 'https://cdn-icons-png.flaticon.com/512/11482/11482650.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. PWA Caching Logic (Critical for Install Button)
const CACHE_NAME = 'gzone-v4-static';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate Event (Clean up old caches)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event (Network First, Fallback to Cache)
// Chrome checks for this event to decide if the app is "Installable"
self.addEventListener('fetch', (event) => {
    // Skip Firestore/Firebase requests to avoid caching dynamic data
    if (event.request.url.includes('firestore.googleapis.com') || 
        event.request.url.includes('firebaseinstallations.googleapis.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

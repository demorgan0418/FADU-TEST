/* ======================================================================================= */
/* OJO: esta configuración tiene que ser EXACTAMENTE la misma que la de firebaseConfig       */
/* dentro de index.html — los dos archivos tienen que apuntar al mismo proyecto de Firebase. */
/* Si estás probando en el proyecto de test, pegá acá la config del proyecto de TEST,        */
/* la misma que hayas puesto en el index.html de esa copia.                                  */
/* ======================================================================================= */
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
   apiKey: "AIzaSyCkreUsZYOpAOw8pitoQ18wC85FVjpTZnw",
  authDomain: "fadu-test.firebaseapp.com",
  projectId: "fadu-test",
  storageBucket: "fadu-test.firebasestorage.app",
  messagingSenderId: "468769530925",
  appId: "1:468769530925:web:2685de102e1d25476044a4"
});

const messaging = firebase.messaging();

// esto se dispara cuando llega un push y la app está cerrada o en otra pestaña
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Control Seguridad FADU";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    vibrate: [150, 80, 150, 80, 150],
  });
});

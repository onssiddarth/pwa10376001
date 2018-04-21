//  Created By
// Id: 10376001
// Name: Siddarth Nair 

var dataCacheName = 'movieData-v1';
var cacheName = 'moviePWA-final-1';
var filesToCache = [
  './',
  './index.html',
  './app.js',
  '/styles.css',
  'images/mercy2.jpg',
  'images/movie.jpg',
  './seatselection.html',
  './numberofseats.html',
  './contactus.html',
  './images/mail.png',
  './images/facebook.png',
  './images/twitter.png',
  './images/googleplus.png',
  './images/linkedin.png',
  './images/rss.png',
  './images/location.png'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://college-movies.herokuapp.com/';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});

'use strict';

importScripts('ngsw-worker.js');

const version = 1;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('sirio-app' + version).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/runtime.js',
        '/polyfills.js',
        '/scripts.js',
        '/vendor.js',
        '/assets/icons/favicon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== 'sirio-app' + version) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

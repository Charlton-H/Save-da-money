const FILES_TO_CACHE = [
  '/',
  './index.html',
  '/css/styles.css',
  '/js/idb.js',
  '/js/index.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];
const APP_PREFIX = 'SaveMoney-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// listen for fetch event
self.addEventListener('fetch', function (e) {
  // if (e.request.url.includes('/api/')) {
  //   e.respondWith(
  //     caches
  //       .open(DATA_CACHE_NAME)
  //       .then((cache) => {
  //         return fetch(e.request)
  //           .then((response) => {
  //             // Clone and store response in cache
  //             if (response.status === 200) {
  //               cache.put(e.request.url, response.clone());
  //             }

  //             return response;
  //           })
  //           .catch((err) => {
  //             // Get response from cache
  //             return cache.match(e.request);
  //           });
  //       })
  //       .catch((err) => console.log(err))
  //   );

  //   return;
  // }
  console.log('fetch request : ' + e.request.url);
  // respond to the request
  e.respondWith(
    // use match to determin if the resource already exists in caches
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache : ' + e.request.url);
        // if cache is available, return cached resource
        return request;
      } else {
        console.log('file is not cached, fetching : ' + e.request.url);
        // if cache is not available, try fetching request
        return fetch(e.request);
      }
    })
  );
});

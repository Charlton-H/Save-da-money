const FILES_TO_CACHE = [
  './public/index.html',
  './public/css/stycles.css',
  './public/js/index.js',
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

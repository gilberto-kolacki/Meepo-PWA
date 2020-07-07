/* eslint-disable no-undef */
/* docs https://developers.google.com/web/tools/workbox/modules/workbox-routing */

workbox.setConfig({
    debug: true,
});
  
// this event isbeing triggered by src/components/PwaDialog.vue
self.addEventListener('message', async (event) => {
    console.log('[Message] event: ' + event.data);
    if (event.data === 'skipWaiting') {
        await self.skipWaiting();
    }
});

// For debugging purposes
self.onactivate = () => {
    if (self.registration.active) {
        console.log('New service worker activated!');
    }
};
  
// self.__precacheManifest is injected by webpack during build, see dist folder
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// CAUTION: navigation route MUST be registered after precacheAndRoute
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL('/index.html'));

// // cache images for 30 days
// workbox.routing.registerRoute(
//   /\.(?:png|gif|jpg|jpeg|svg)$/,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'images',
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 60,
//         maxAgeSeconds: 30 * 24 * 60 * 60,
//       }),
//     ],
//   }),
// );

// chrome media for 30 days
// workbox.routing.registerRoute(
//   /\.(?:webp)$/,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'webp',
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 60,
//         maxAgeSeconds: 30 * 24 * 60 * 60,
//       }),
//     ],
//   }),
// );

// cache fonts?
// workbox.routing.registerRoute(
//   new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
//   workbox.strategies.cacheFirst({
//     cacheName: 'googleapis',
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 30,
//       }),
//     ],
//   }),
// );

// log unhandled caches
workbox.routing.setDefaultHandler(({ url, event, params }) => {
console.warn('not cached:' + url);
});
  
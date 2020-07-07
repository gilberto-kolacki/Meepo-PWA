import { register } from 'register-service-worker';

// TODO: vue has better ways of handling events, consider using Vuex or another eventBus to listen to this events
/**
 * Dispatch event to listener window
 * @param {*} eventName event name used to register listener
 * @param {*} detail additional data attached to the event
 */
function dispatchEvent(eventName, detail) {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
}

register(`${process.env.BASE_URL}service-worker.js`, {
  ready() {
    console.log('Service worker is active.');
    dispatchEvent('onServiceWorkerReady');
  },
  registered(registration) {
    console.log('Service worker has been registered.');
    dispatchEvent('onServiceWorkerRegistered', { registration });
  },
  cached(registration) {
    console.log('Content has been cached for offline use.');
    dispatchEvent('onServiceWorkerCached', { registration });
  },
  updatefound(registration) {
    console.log('New content is downloading.');
    dispatchEvent('onServiceWorkerUpdateFound', { registration });
  },
  updated(registration) {
    console.log('New content is available; please refresh.');
    // this event is being listened by src/components/PwaDialog.vue
    dispatchEvent('onServiceWorkerUpdated', { registration });
  },
  offline() {
    console.log('No internet connection. App is running in offline mode.');
    dispatchEvent('onServiceWorkerOffline');
  },
  error(error) {
    console.error('Error during service worker registration:', error);
    dispatchEvent('onServiceWorkerError', { error });
  },
});

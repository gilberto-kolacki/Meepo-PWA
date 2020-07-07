<template>
<div v-if="visible">
    <!-- TODO: ?? this component is renderless because vuesax handle notification template in runtime -->
</div>
</template>

<script>

export default {
  name: 'PwaDialog',

  props: {},

  data() {
    return {
        registration: null,
        visible: false
    };
  },

  methods: {
    onServiceWorkerUpdated(e) {
      this.registration = e.detail.registration;
      this.show();
    },

    reload() {
      if (this.registration && this.registration.waiting) {
        // this event is being listened by src/service-worker.js
        this.$router.push({ name: 'atualizacao' });
      } else {
        console.warn("No service worker waiting to be activated");
        this.close();
      }
    },

    show() {
        this.visible = true;
        this.$vs.notify({
            position: "bottom-center",
            color: "dark",
            text: "Nova versão disponibilizada, verique!",
            click: this.reload
        });
    },

    close() {
        this.visible = false;
        // TODO: handle path where user can cancel or postpone window reload?
    },
  },

  created() {
    // this event is being triggered by src/registerServiceWorker.js
    window.addEventListener('onServiceWorkerUpdated', this.onServiceWorkerUpdated);
    // DEBUG HELPER: uncomment this in case you need to see the dialog without doing the whole service worker flow.
    // this.show();
  },

  destroyed() {
    window.removeEventListener('onServiceWorkerUpdated', this.onServiceWorkerUpdated);
  },
};
</script>

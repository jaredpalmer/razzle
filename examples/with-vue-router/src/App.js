import Vue from 'vue';
import VueApp from './App.vue';

import router from './router';

// Export a factory function for creating a fresh app
export function createVueApp() {
  const app = new Vue({
    router,
    render: h => h(VueApp),
  });

  return { app, router };
}

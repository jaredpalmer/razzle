import Vue from 'vue';
import VueApp from './App.vue';

// Export a factory function for creating a fresh app
export function createVueApp() {
  const app = new Vue({
    render: h => h(VueApp),
  });

  return { app };
}

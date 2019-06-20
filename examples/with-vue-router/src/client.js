import { createVueApp } from './App';

const { app, router } = createVueApp();

router.onReady(() => {
  app.$mount('#app');
});

if (module.hot) {
  module.hot.accept();
}

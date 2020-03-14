import { createVueApp } from './App';

const { app } = createVueApp();
app.$mount('#app');

if (module.hot) {
  module.hot.accept();
}

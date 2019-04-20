import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './Home.vue';

// The () => import() syntax is used for webpack's lazy loading and code splitting functionality
// https://router.vuejs.org/guide/advanced/lazy-loading.html
const About = () => import(/* webpackChunkName: "AboutPage" */ './About.vue');
const PageNotFound = () =>
  import(/* webpackChunkName: "PageNotFound" */ './PageNotFound.vue');

Vue.use(VueRouter);

// Create a router in history mode
// By default vue-router uses `hash mode` urls: localhost:3000/#/about
// `History mode` allows regular urls: localhost:3000/about
export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '*', component: PageNotFound }, // wildcard route match, if haven't matched previous: 404
  ],
});

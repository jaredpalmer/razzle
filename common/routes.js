import PageWithSSR from './PageWithSSR';
import PageWithoutSSR from './PageWithoutSSR';

const routes = [
  {
    path: '/',
    component: PageWithSSR,
    name: 'PageWithSSR',
    exact: true
  },
  {
    path: '/pagewithoutssr',
    component: PageWithoutSSR,
    name: 'PageWithoutSSR',
    exact: true
  }
];

export default routes;

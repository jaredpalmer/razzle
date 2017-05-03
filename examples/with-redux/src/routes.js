import Master from './containers/Master';
import Detail from './containers/Detail';

export default [
  {
    path: '/',
    exact: true,
    component: Master,
  },
  {
    path: '/posts/:id',
    exact: true,
    component: Detail,
  },
];

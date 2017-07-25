// @flow
import { getUsers } from './helpers/fetches';

import type { RouteDataList } from './components/RoutePublisher';

const routes: RouteDataList = [
  { path: '/', target: 'top' },
  { path: '/signin', target: 'signin' },

  { path: '/users', target: 'users', fetches: { users: () => getUsers() } },
  { path: '/users/:id', target: 'users/:id/user-detail' },
];

export default routes;

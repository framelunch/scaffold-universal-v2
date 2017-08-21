// @flow
import { fetchUsers } from './store/users';

import type { RouteDataList } from './components/RoutePublisher';

const routes: RouteDataList = [
  { path: '/', target: 'top' },
  { path: '/signin', target: 'signin' },

  { path: '/users', target: 'users', fetches: [fetchUsers] },
  { path: '/users/:id', target: 'users/:id/user-detail' },
];

export default routes;

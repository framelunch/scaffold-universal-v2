// @flow
import { fetchUsers } from './store/users';

const routes = [
  { path: '/', target: 'top' },
  { path: '/signin', target: 'signin' },

  { path: '/users', target: 'users', fetches: [fetchUsers] },
  { path: '/users/:id', target: 'users/:id/user-detail' },
];

export default routes;

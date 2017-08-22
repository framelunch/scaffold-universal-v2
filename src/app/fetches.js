import { QUERY_NAME } from '../etc/define';
import { createLoading, removeLoading } from './store/loading';

const { DOMAIN } = process.env;

let dispatch;
const defaultOption = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
const serialize = data => (
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
);

export function initFetch(store) {
  dispatch = store.dispatch;
  defaultOption.headers.Authorization = `Bearer ${store.getState().token}`;
}
export function exec(url, option) {
  // Start loading
  dispatch(createLoading());

  // FIXME: 新規のObjectを作らないとdefaultOptionが上書きされる
  option = Object.assign({}, defaultOption, option);
  const { method, headers, data } = option;

  if (/GET/.test(method) && data) {
    if (data[QUERY_NAME]) {
      option.data[QUERY_NAME] = encodeURIComponent(JSON.stringify(data[QUERY_NAME]));
    }
    url = `${url}?${serialize(option.data)}`;
  }
  if (/POST|PUT/.test(method) && data) {
    option.body = headers['Content-Type'] === 'application/json' ?
      JSON.stringify(data) : data;
  }
  delete option.data;

  return fetch(url, option)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      return new Error(response.statusText);
    })
    .then(result => {
      // end loading
      dispatch(removeLoading());
      return result;
    });
}
export function graphql(query, variables) {
  return exec(`${DOMAIN}/graphql`, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  });
}

// FIXME: GraphQLに差し替え
/**
 * Fetch List （RESTの参考用に一応残しておく）
 */
const USERS_ME = `${DOMAIN}/api/users/me`;

export function getMe() {
  return exec(USERS_ME);
}

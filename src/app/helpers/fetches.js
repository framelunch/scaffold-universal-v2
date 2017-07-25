const { DOMAIN } = process.env;
const AUTH_LOCAL = `${DOMAIN}/auth/local`;
const USERS = `${DOMAIN}/api/users`;
const USERS_ME = `${DOMAIN}/api/users/me`;

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function response(result) {
  if (result.ok) {
    return result.json();
  }
  return new Error(result.statusText);
}

export function getMe(token) {
  return fetch(USERS_ME, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }).then(response);
}

export function getUsers() {
  return fetch(USERS, { headers })
    .then(response);
}

export function signIn(postData) {
  return fetch(AUTH_LOCAL, {
    headers,
    method: 'POST',
    body: JSON.stringify(postData),
  }).then(response);
}

import 'babel-polyfill';
import $ from 'jquery';
import cookie from 'js-cookie';

const $email = $('#email');
const $pass = $('#pass');
const $loginBt = $('#login-bt');

const { COOKIE_LOGIN_TOKEN } = process.env;
const token = cookie.get(COOKIE_LOGIN_TOKEN);

function init() {
  $('body').show();
  $loginBt.on('click', () => {
    const email = $email.val();
    const password = $pass.val();

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/auth/local',
      data: {
        email,
        password,
      },
      success: result => {
        if (result.token) {
          cookie.set(COOKIE_LOGIN_TOKEN, result.token);
          location.href = '/';
        }
      },
    });
  });
}

if (token) {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    headers: { Authorization: `Bearer ${token}` },
    url: '/api/users/me',
    success: result => {
      location.href = '/';
    },
    error: () => {
      init();
    },
  });
} else {
  init();
}

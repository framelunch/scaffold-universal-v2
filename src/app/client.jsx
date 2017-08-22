import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import initStore from './store';
import { initFetch } from './fetches';
import App from './';

const initialState = JSON.parse(document.querySelector('#initial-data').dataset.text);
const store = initStore(initialState);
initFetch(store);

render(
  <BrowserRouter>
    <AppContainer>
      <App store={store} />
    </AppContainer>
  </BrowserRouter>,
  document.getElementById('app'),
);

/* eslint-disable */
if (module.hot) {
  module.hot.accept('./', () => {
    const NextRoot = require('./').default;
    render(
      <BrowserRouter>
        <AppContainer>
          <NextRoot store={store} />
        </AppContainer>
      </BrowserRouter>,
      document.getElementById('app')
    );
  });
}
/* eslint-enable */

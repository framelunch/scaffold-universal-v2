// @flow
import 'babel-polyfill';
import 'isomorphic-fetch';
import 'rxjs';

import React from 'react';
import { Provider } from 'react-redux';

import Header from './containers/Header';
import Footer from './containers/Footer';

import RoutePublisher from './components/RoutePublisher';
import Route from './components/Route';
import routeConfig from './route-config';

import Top from './containers/Top';
import Users from './containers/Users';
import SignIn from './containers/SignIn';


type AppProps = {
  store: any
};

export default class App extends React.Component<void, AppProps, void> {
  store: any;

  constructor(props: AppProps) {
    super(props);
    this.store = props.store;
  }
  render() {
    return (
      <Provider store={this.store}>
        <RoutePublisher routes={routeConfig} store={this.store}>
          <Header />

          <Route component={Top} route="top" />
          <Route component={Users} route="users" />
          <Route component={SignIn} route="signin" />

          <Footer />
        </RoutePublisher>
      </Provider>
    );
  }
}

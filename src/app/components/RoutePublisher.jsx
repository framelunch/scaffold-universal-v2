// @flow
import React from 'react';
import { withRouter, Redirect, matchPath } from 'react-router-dom';
import State from '../../libs/core/State';
import looptime from '../../libs/utils/looptime';

export function fetchRoute(url: string, routes: Array<any>): any {
  let i = 0;
  const l = routes.length;

  for (i; i < l; i += 1) {
    const route = routes[i];
    const match = matchPath(url, { path: route.path });
    if (match && match.isExact) {
      return { route, match };
    }
  }
  return {};
}

let targetRoute = {};
export function getTargetRoute(): any {
  return targetRoute;
}
export function isMatch(target: string): boolean {
  const { route } = targetRoute;
  return (route ? route.target : '').indexOf(target) > -1;
}

export const state = State();

type RoutePublisherProps = {
  location: any,
  store: any,
  routes: Array<any>,
  children: Array<any>,
};

class RoutePublisher extends React.Component<void, RoutePublisherProps, void> {
  componentWillMount() {

  }
  render() {
    const { location, routes, store, children } = this.props;
    const { route, match } = fetchRoute(location.pathname, routes);

    if (route) {
      if (targetRoute.path !== route.path) {
        targetRoute = { route, match };
        state.change(route.target, [targetRoute]);

        setTimeout(() => {
          // route-configで定義されているfetchesはここに集約する
          const fetches = route.fetches || [];
          fetches.map(fetch => fetch(store, match));
        }, looptime);
      }
      return <div>{children}</div>;
    }

    targetRoute = { route: routes[0], match };
    return <Redirect to={targetRoute.route.path} />;
  }
}

export default withRouter(RoutePublisher);

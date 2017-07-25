// @flow
import React from 'react';
import { withRouter, Redirect, matchPath } from 'react-router-dom';
import State from '../../libs/core/State';

export type RouteData = {
  path: string,
  target: string,
  fetch?: any,
  match?: any
};
export type RouteDataList = Array<RouteData>;

export type FetchRouteResult = {
  route?: RouteData,
  match?: any
};

export let targetRoute: RouteData;
export const state = State();

export function fetchRoute(url: string, routes: RouteDataList): FetchRouteResult {
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

type RoutePublisherProps = {
  location: any,
  routes: RouteDataList
};

class RoutePublisher extends React.Component<void, RoutePublisherProps, void> {
  render() {
    const { location, routes } = this.props;
    const { route, match } = fetchRoute(location.pathname, routes);

    if (route) {
      targetRoute = route;
      state.change(route.target, match ? [match.params] : null);
      return null;
    }

    targetRoute = routes[0];
    return <Redirect to={targetRoute.path} />;
  }
}

export default withRouter(RoutePublisher);

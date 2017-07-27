// @flow
import React from 'react';
import { withRouter, Redirect, matchPath } from 'react-router-dom';
import State from '../../libs/core/State';

export type RouteData = {
  path: string,
  target: string,
  fetches?: Array<any> | null,
  match?: any
};
export type RouteDataList = Array<RouteData>;

export type FetchRouteResult = {
  route?: RouteData,
  match?: any
};

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

let targetRoute = null;
export function getTargetRoute(): RouteData | null {
  return targetRoute;
}

export const state = State();

type RoutePublisherProps = {
  location: any,
  routes: RouteDataList,
  store: any,
  children: Array<any>
};

const RoutePublisher = ({ location, routes, store, children }: RoutePublisherProps) => {
  const { route, match } = fetchRoute(location.pathname, routes);

  if (route) {
    // route-configで定義されているfetchesはここに集約する
    // FIXME: tokenをどうやって渡そうかな -> state.signIn.tokenに保持する
    const fetches = route.fetches || [];
    fetches.map(fetch => fetch(store, match));

    targetRoute = route;
    state.change(route.target, [match]);
    return <div>{children}</div>;
  }

  targetRoute = routes[0];
  return <Redirect to={targetRoute.path} />;
};

export default withRouter(RoutePublisher);

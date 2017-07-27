// @flow
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import config from '../config';
import { fetchRoute } from './components/RoutePublisher';
import { initStore } from './store';
import { signInResult, fetchMe } from './store/signIn';
import routes from './route-config';
import App from './';

function isTruthy(val) {
  return !!val;
}

function getJsByChunkName(name, { assetsByChunkName }) {
  let assets = assetsByChunkName[name];
  if (!Array.isArray(assets)) {
    assets = [assets];
  }
  return assets.find(asset => /\.js$/.test(asset));
}

function getCssByChunkName(name, { assetsByChunkName }) {
  let assets = assetsByChunkName[name];
  if (!Array.isArray(assets)) {
    assets = [assets];
  }
  return assets.find(asset => /\.css$/.test(asset));
}

function getJs(stats) {
  return [
    getJsByChunkName('vendor', stats),
    getJsByChunkName('client', stats),
  ].filter(isTruthy);
}

function getCss(stats) {
  return [getCssByChunkName('client', stats)].filter(isTruthy);
}

export default ({ clientStats }: any) => {
  // Build stats maps for quicker lookups.
  const modulesById = clientStats.modules.reduce((modules, mod) => {
    modules[mod.id] = mod;
    return modules;
  }, {});
  const chunksById = clientStats.chunks.reduce((chunks, chunk) => {
    chunks[chunk.id] = chunk;
    return chunks;
  }, {});
  const assetsByChunkName = clientStats.assetsByChunkName;

  return (req: any, res: any) => {
    const store = initStore({});
    const { route, match } = fetchRoute(req.url, routes);

    // FIXME: fetchesを複製しないと、フロント側にfetchMeが挿入されてしまう
    const fetches: any = (route ? (route.fetches || []) : []).slice(0);
    fetches.push(fetchMe);

    // tokenがある場合は、state.signIn.tokenに格納する
    const token = req.cookies[config.cookie.LOGIN_TOKEN];
    if (token) store.dispatch(signInResult({ token }));

    Promise
      .all(fetches.map(fetch => fetch(store, match)))
      .then(() => {
        const context = {};
        const component = renderToString(
          <StaticRouter location={req.url} context={context}>
            <App store={store} />
          </StaticRouter>);

        const stats = {
          modulesById,
          chunksById,
          assetsByChunkName,
        };

        const js = getJs(stats);
        const css = getCss(stats);
        const head = Helmet.renderStatic();

        // FIXME: router-helmetを使ってmeta情報も正しくセットアップ
        return res.render('_app', {
          conf: {
            isApp: true,
            title: head.title.toString(),
            meta: head.meta.toString(),
            style: ['/css/default.css'].concat(css),
            script: [].concat(js),
          },
          component,
          appState: serialize(store.getState()),
        });
      });
  };
};

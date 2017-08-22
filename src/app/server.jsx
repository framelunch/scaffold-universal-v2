// @flow
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import { fetchRoute } from './components/RoutePublisher';
import { initFetch, graphql } from './fetches';
import initStore from './store';
import { signIn } from './store/signIn';
import routes from './routes';
import App from './';

const { COOKIE_LOGIN_TOKEN } = process.env;

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
    // TODO: tokenがcookieに依存しているのがuniversalっぽくないな。。
    // tokenがない場合は、index.ejs（Signup）を表示する。ある場合はstoreに格納
    const token = req.cookies[COOKIE_LOGIN_TOKEN];
    if (!token) return res.render('index');

    // マッチしたrouteがない場合はtopページへ
    const { route, match } = fetchRoute(req.url, routes);
    if (!route) return res.redirect(routes[0].path);

    const store = initStore({ token });
    const fetches: any = route.fetches || [];
    const isAdmin: boolean = route.isAdmin === undefined ? false : route.isAdmin;

    // fetchesを初期化
    initFetch(store);

    // return getMe().then(result => {
    return graphql('query { me { _id, name } }').then(result => {
      // meが取得できない場合はsigninページへリダイレクト
      if (result instanceof Error) return res.redirect('/signin');

      // Adminのページへのアクセスで自身がAdminではない場合はTOPへリダイレクト
      const me = result.data.me;
      if (isAdmin && me.role !== 'admin') return res.redirect('/');

      store.dispatch(signIn(me));

      return Promise
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
              style: ['default.css'].concat(css),
              script: [].concat(js),
            },
            component,
            appState: serialize(store.getState()),
          });
        });
    });
  };
};

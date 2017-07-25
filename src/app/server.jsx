// @flow
import React from 'react';
import { compose } from 'redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { flushWebpackRequireWeakIds } from 'react-loadable';
import config from '../config';
import { fetchRoute } from './components/RoutePublisher';
import { getMe } from './helpers/fetches';
import { STATUS_FINISHED, initStore } from './store';
import routes from './route-config';
import App from './';

import flatten from './helpers/flatten';
import uniq from './helpers/uniq';

const flattenUniq = compose(uniq, flatten);

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

function getJsByModuleIds(moduleIds, { modulesById, chunksById }) {
  const chunkIds = flatten(
    moduleIds.map(id => {
      const clientModule = modulesById[id];
      if (!clientModule) {
        throw new Error(`${id} not found in client stats`);
      }
      return clientModule.chunks;
    })
  );
  return flattenUniq(
    chunkIds.map(id => {
      return chunksById[id].files
        .filter(file => /\.js$/.test(file))
        .filter(file => !/\.hot-update\.js$/.test(file));
    })
  );
}

function getCssByChunkName(name, { assetsByChunkName }) {
  let assets = assetsByChunkName[name];
  if (!Array.isArray(assets)) {
    assets = [assets];
  }
  return assets.find(asset => /\.css$/.test(asset));
}

function getJs(moduleIds, stats) {
  return [
    getJsByChunkName('bootstrap', stats),
    ...getJsByModuleIds(moduleIds, stats),
    getJsByChunkName('client', stats)
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
    const initialState: any = {};

    /**
     * 指定のURLに必要なデータを取得するPromiseをまとめる
     */
    const { route } = fetchRoute(req.url, routes);
    const fetches: any = route ? (route.fetches || {}) : {};

    /**
     * ログインユーザーの情報を最初に取得
     */
    const token = req.cookies[config.cookie.LOGIN_TOKEN];
    if (token) {
      fetches.signIn = () => getMe(token);
    }

    Promise.all(
      Object.keys(fetches).reduce((docs, key) => {
        docs.push(fetches[key]().then(data => (
          new Promise(resolve => {
            initialState[key] = { data, status: STATUS_FINISHED };
            resolve();
          })
        )));
        return docs;
      }, []),
    ).then(() => {
      const context = {};
      const component = renderToString(
        <StaticRouter location={req.url} context={context}>
          <App store={initStore(initialState)} />
        </StaticRouter>);

      const stats = {
        modulesById,
        chunksById,
        assetsByChunkName
      };
      const moduleIds = flushWebpackRequireWeakIds();
      const js = getJs(moduleIds, stats);
      const css = getCss(stats);

      // TODO: router-helmetを使ってmeta情報も正しくセットアップ
      return res.render('_app', {
        conf: {
          title : 'app | universal application',
          description : 'spa page',
          style: ['/css/default.css'].concat(css),
          script: [].concat(js)
        },
        component,
        appState: serialize(initialState),
      });
    });
  }
}

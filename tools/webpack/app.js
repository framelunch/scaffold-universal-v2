const fs = require('fs');
const path = require('path');

/** rules **/
const javascript = require('./rules/javascript');
const { css, cssModules } = require('./rules/css');
const font = require('./rules/font');
const image = require('./rules/image');
const video = require('./rules/video');
const audio = require('./rules/audio');

/** plugins **/
const extractCss = require('./plugins/extractCss');
const optimize = require('./plugins/optimize');
const stats = require('./plugins/stats');
const hmr = require('./plugins/hmr');
const codeSplitting = require('./plugins/codeSplitting');
const bootstrapChunk = require('./plugins/bootstrapChunk');

const conf = require('../config').webpack.app;
const SRC_DIR = conf.src;
const DIST_DIR = conf.dist;
const DEFAULTS = conf.defaults;

const createConfig = options => {
  options = Object.assign({}, DEFAULTS, options);

  const { name, revision, node, publicPath, sourceMap, hot } = options;

  return {
    name,
    context: SRC_DIR,
    entry: ((_node) => {
      const value = {
        [name]: hot
            ? [
              'react-hot-loader/patch',
              'webpack-hot-middleware/client',
              `./${name}.jsx`
            ]
            : `./${name}.jsx`
      };
      if (!_node) value.vendor = [
        'react',
        'react-dom',
        'react-redux',
        'react-router-dom',
        'react-helmet',
        'react-hot-loader',
        'redux',
        'redux-actions',
        'redux-observable',
        'isomorphic-fetch',
        'rxjs',
        'animejs',
      ];
      return value;
    })(node),
    resolve: {
      modules: [SRC_DIR, 'node_modules'],
      extensions: ['.jsx', '.js'],
    },
    output: {
      path: DIST_DIR,
      filename: revision ? '[name].[chunkhash].js' : '[name].js',
      libraryTarget: node ? 'commonjs2' : 'var',
      publicPath
    },
    module: {
      rules: [
        javascript(SRC_DIR),
        css(/node_modules/, options),
        cssModules(SRC_DIR, options),
        font(SRC_DIR),
        image(SRC_DIR),
        video(SRC_DIR),
        audio(SRC_DIR)
      ]
    },

    plugins: [
      ...extractCss(options),
      ...optimize(options),
      ...stats(options),
      ...hmr(options),
      ...codeSplitting(options),
      ...bootstrapChunk(options)
    ],

    devtool: sourceMap ? sourceMap : '',
    target: node ? 'node' : 'web',
    externals: node
      ? fs
        .readdirSync('node_modules')
        .filter(x => !x.includes('.bin') && !x.includes('react-loadable'))
        .reduce((externals, mod) => {
          externals[mod] = `commonjs ${mod}`;
          return externals;
        }, {})
      : {},
    node: {
      process: false
    },
    bail: true
  };
};

exports.development = [
  createConfig({
    name: 'client',
    sourceMap: 'eval',
    hot: true,
    bootstrapChunk: true,
    publicPath: `http://localhost:${process.env.PORT}/`
  }),
  createConfig({
    name: 'server',
    node: true,
    sourceMap: 'eval',
    codeSplitting: false
  })
];
exports.production = [
  createConfig({
    name: 'client',
    optimize: true,
    revision: true,
    extractCss: true,
    stats: true,
    bootstrapChunk: true
  }),
  createConfig({
    name: 'server',
    node: true,
    optimize: true,
    codeSplitting: false
  })
];

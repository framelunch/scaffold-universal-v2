const path = require('path');
const globby = require('globby');
const webpack = require('webpack');
const UglifyJs = require('uglifyjs-webpack-plugin');
const conf = require('../config');
const { browserslist } = require('../../package.json');

const entry = {
  vendor: ['jquery', 'animejs']
};

globby.sync(conf.script.src)
  .forEach((filename) => {
    const basename = path.basename(filename, path.extname(filename));
    entry[basename] = `./${filename}`;
  });

const createConfig = option => (
  {
    entry,
    output: {
      filename: '[name].js'
    },
    resolve: {
      modules: [
        'node_modules',
      ],
      extensions: ['.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {
                  targets: {browsers: browserslist},
                  useBuiltIns: true,
                  modules: process.env.NODE_ENV === 'production' ? false : 'commonjs',
                  //debug: process.env.NODE_ENV === 'development' //なんかうっとおしいのでコメントアウト、、
                }]
              ],
              plugins: [
                'transform-object-rest-spread'
              ],
              cacheDirectory: true,
              babelrc: false
            },
          },
        }
      ],
    },
    cache: option.cache,
    devtool: option.devtool,
    plugins: option.plugins
  }
);

exports.development = createConfig({
  cache: true,
  devtool: 'inline-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.script.js' }),
  ]
});
exports.production = createConfig({
  cache: false,
  devtool: '',
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: false }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': "'production'" }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.script.js' }),
    new UglifyJs(),
  ]
});

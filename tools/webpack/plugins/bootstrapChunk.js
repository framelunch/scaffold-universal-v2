const webpack = require('webpack');

/**
 * Move webpack bootstrap to separate chunk to allow code split chunks to be
 * loaded *before* main.
 */
module.exports = ({ bootstrapChunk, revision, name }) =>
  (bootstrapChunk ? [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].app.js',
      minChunks: Infinity
    })
  ] : []);

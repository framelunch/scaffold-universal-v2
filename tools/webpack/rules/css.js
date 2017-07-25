const ExtractTextPlugin = require('extract-text-webpack-plugin');
const customProperties = require('postcss-custom-properties');
const customMedia = require('postcss-custom-media');
const nested = require('postcss-nested');
const importCss = require('postcss-import');
const autoprefixer = require('autoprefixer');

const getLoaders = (modules, { node, sourceMap, optimize }) => {
  const cssLoaderOptions = {
    modules,
    sourceMap: !!sourceMap,
    minimize: optimize,
    localIdentName: optimize
      ? '[hash:base64]'
      : '[name]-[local]-[hash:base64:5]'
  };

  if (node) {
    return [
      {
        loader: 'css-loader/locals',
        options: cssLoaderOptions
      }
    ];
  }

  return ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: cssLoaderOptions
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: (loader) => [
            importCss({root: loader.resourcePath}),
            customProperties(),
            customMedia(),
            nested(),
            autoprefixer()
          ]
        }
      }
    ]
  });
};

exports.css = (include, options) => {
  const loaders = getLoaders(false, options);
  return {
    test: /\.css$/,
    include,
    use: loaders
  };
};

exports.cssModules = (include, options) => {
  const loaders = getLoaders(true, options);
  return {
    test: /\.css$/,
    include,
    use: loaders
  };
};

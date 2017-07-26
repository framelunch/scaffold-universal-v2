const { browserslist } = require('../../../package.json');

module.exports = include => {
  return {
    test: /\.(js|jsx)$/,
    include,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', {
            targets: {browsers: browserslist},
            useBuiltIns: true,
            modules: process.env.NODE_ENV === 'production' ? false : 'commonjs',
          }],
          'react',
          'flow'
        ],
        plugins: [
          'transform-class-properties',
          'transform-object-rest-spread'
        ],
        cacheDirectory: true,
        babelrc: false
      }
    }
  };
};

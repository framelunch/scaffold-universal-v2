module.exports = include => {
  return {
    test: /\.(js|jsx)$/,
    include,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', {
            useBuiltIns: true,
            modules: process.env.NODE_ENV === 'production' ? false : 'commonjs',
            debug: process.env.NODE_ENV === 'development'
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

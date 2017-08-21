require('dotenv').config();
const path = require('path');
const { PORT } = process.env;

module.exports = {
  dest: {
    dev: '.tmp',
    build: 'build',
  },

  copy: {
    assets: ['src/assets/**/*'],
  },

  view: {
    src: ['src/views/**/*.ejs', '!src/views/**/_*', '!src/views/index.ejs'],
    watch: ['src/views/**/*.ejs'],
    rename(path) {
      if (path.basename !== 'index') {
        let basename = 'index';
        let dirname = `${path.dirname}/`;

        dirname += path.basename.split('.').reduce((str, item) => {
          if (item.charAt(0) === '$') {
            basename = item.substr(1);
          } else {
            str += `${item}/`;
          }
          return str;
        }, '');

        path.basename = basename;
        path.dirname = dirname;
      }
    },
  },

  style: {
    src: ['src/styles/**/*.css', '!src/styles/**/_*'],
    watch: ['src/styles/**/*.css']
  },

  script: {
    src: ['src/scripts/**/*.{js,jsx}', '!src/scripts/**/_*'],
    watch: {
      script: ['src/scripts/**/*']
    }
  },

  webpack: {
    app: {
      src: path.join(__dirname, '../src/app'),
      dist: path.join(__dirname, '../build/'),
      defaults: {
        name: '',
        revision: false,
        node: false,
        sourceMap: false,
        hot: false,
        optimize: false,
        extractCss: false,
        stats: false,
        codeSplitting: true,
        bootstrapChunk: false,
        publicPath: ''
      }
    }
  },

  browser: {
    proxy: `http://localhost:${PORT}`,
    port: PORT-1,
    notify: false,
    reloadDebounce: 500
  },

  nodemon: {
    script: 'src/server.js',
    ext: 'js',
    execMap: {
      js: "node"
    },
    // FIXME: watchにsrc/appディレクトリを含めるとHMRがリロードしまくってひどい感じに
    watch: [
      'src/server.js',
      'src/routes/**/*',
      'src/models/**/*',
      'src/config/**/*',
      'src/auth/**/*',
      'src/api/**/*',
      'src/graphql/**/*'
    ],
  }
};

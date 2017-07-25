require('dotenv').config();
const { PORT } = process.env;

module.exports = {
  dest: {
    dev: '.tmp',
    build: 'build',
  },

  copy: {
    static: ['src/*.*'],
    assets: ['src/assets/**/*'],
  },

  view: {
    src: ['src/views/**/*.ejs', '!src/views/**/_*'],
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
    watch: ['src/styles/**/*.css', 'src/libs/**/*.css']
  },

  script: {
    src: ['src/scripts/**/*.{js,jsx}', '!src/scripts/**/_*'],
    watch: {
      script: ['src/scripts/**/*', 'src/libs/**/*.js']
    }
  },

  webpack: {

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
    ignore: [
      'src/app/**/*',
      'src/libs/**/*',
      'src/scripts/**/*',
      'src/styles/**/*',
      'src/assets/**/*'
    ],
    execMap: {
      js: "node"
    },
    watch: ['src/**/*']
  }
};

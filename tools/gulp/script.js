const gulp = require('gulp');
const plumber = require('gulp-plumber');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const conf = require('../config');
const browser = require('browser-sync');

const confScript = require('../webpack/script');

gulp.task('script', () => (
  plumber()
    .pipe(webpackStream(confScript.development, webpack))
    .pipe(gulp.dest(`${conf.dest.dev}`))
    .pipe(browser.reload({ stream: true }))
));

gulp.task('b.script', () => (
  webpackStream(confScript.production, webpack)
    .pipe(gulp.dest(`${conf.dest.build}`))
));

const confApp = require('../webpack/app');
const tasks = confApp.production.map((_conf) => {
  const name = `b.app.${_conf.name}`;
  gulp.task(name, () => (
    webpackStream(_conf, webpack)
      .pipe(gulp.dest(`${conf.dest.build}`))
  ));
  return name;
});
gulp.task('b.app', tasks);

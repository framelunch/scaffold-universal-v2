const gulp = require('gulp');
const plumber = require('gulp-plumber');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const conf = require('../config');
const browser = require('browser-sync');

const confScript = require('../webpack/script');
//const confApp = require('../webpack/app');
//const confServer = require('../webpack/server');

gulp.task('script', () => (
  plumber()
    .pipe(webpackStream(confScript.development, webpack))
    .pipe(gulp.dest(`${conf.dest.dev}`))
    .pipe(browser.reload({ stream: true }))
));

gulp.task('b.script', () => (
  webpackStream(confScript.production, webpack)
    .pipe(gulp.dest(`${conf.dest.build}/js`))
));

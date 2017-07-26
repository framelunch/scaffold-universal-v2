const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const nodemon = require('gulp-nodemon');
const rimraf = require('rimraf');
const browser = require('browser-sync');
const runSequence = require('run-sequence');
const conf = require('../config');

gulp.task('clean', cb => rimraf(conf.dest.dev, {}, cb));
gulp.task('b.clean', cb => rimraf(conf.dest.build, {}, cb));
gulp.task('copy.static', () => {
  return gulp.src(conf.copy.static)
    .pipe(gulp.dest(`${conf.dest.build}`));
});
gulp.task('copy.assets', () => {
  return gulp.src(conf.copy.assets)
    .pipe(gulpif('*.{png,jpg,gif}', imagemin()))
    .pipe(gulp.dest(`${conf.dest.build}/assets`));
});

gulp.task('nodemon', (cb) => {
  let started = false;
  return nodemon(conf.nodemon)
    .on('start', () => {
      if (!started) {
        cb();
        started = true;
      }
    })
    .on('restart', () => {
      setTimeout(() => {
        browser.reload();
      }, 2000);
    });
});
gulp.task('server', ['nodemon'], () => (
  setTimeout(() => {
    browser.init(null, conf.browser);
  }, 2000)
));

gulp.task('dev', cb => (
  runSequence(
    'clean',
    ['view', 'style', 'script'],
    'server',
    cb,
  )
));

gulp.task('default', ['dev'], () => {
  gulp.watch(conf.view.watch, ['view']);
  gulp.watch(conf.style.watch, ['style']);
  //gulp.watch(conf.script.watch.script, ['script']);
});

gulp.task('build', function (cb) {
  return runSequence(
    'b.clean',
    ['b.style', 'b.script'],
    ['copy.static', 'copy.assets'],
    cb
  );
});

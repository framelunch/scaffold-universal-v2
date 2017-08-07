'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const ejs = require('gulp-ejs');
const aglio = require('gulp-aglio');
const rename = require('gulp-rename');
const browser = require('browser-sync');
const DIR = 'docs';

gulp.task('blueprint-combine', function () {
  return gulp.src(DIR + '/_index.ejs')
    .pipe(plumber())
    .pipe(ejs(null, {}, {ext: '.md'}))
    .pipe(rename(function (path) {
      path.basename = 'index';
    }))
    .pipe(gulp.dest(DIR));
});

gulp.task('blueprint-aglio', ['blueprint-combine'], function() {
  gulp.src(DIR + '/index.md')
    .pipe(plumber())
    .pipe(aglio({template: 'slate'}))
    .pipe(gulp.dest(DIR))
    .pipe(browser.reload({stream:true}));
});

gulp.task('blueprint-watch', function () {
  gulp.watch(DIR + '/*', ['blueprint-aglio']);
});

gulp.task('blueprint-browser', function() {
  browser({
    notify: false,
    port: 10000,
    server: {
      baseDir: DIR
    }
  });
});

gulp.task('blueprint', ['blueprint-aglio', 'blueprint-watch', 'blueprint-browser']);

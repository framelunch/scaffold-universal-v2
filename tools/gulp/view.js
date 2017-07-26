const gulp = require('gulp');
const plumber = require('gulp-plumber');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const minifyHtml = require('gulp-minify-html');
const conf = require('../config');
const browser = require('browser-sync');

gulp.task('view', () => (
  gulp.src(conf.view.src)
    .pipe(plumber())
    .pipe(ejs(null, {}, { ext: '.html' }))
    .pipe(rename(conf.view.rename))
    .pipe(gulp.dest(conf.dest.dev))
    .pipe(browser.reload({ stream: true }))
));

gulp.task('b.view', () => (
  gulp.src(conf.view.src)
    .pipe(ejs(null, {}, { ext: '.html' }))
    .pipe(minifyHtml())
    .pipe(rename(conf.view.rename))
    .pipe(gulp.dest(conf.dest.build))
));

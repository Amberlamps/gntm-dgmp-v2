'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var path = require('path');
var util = require('gulp-util');
var rename = require("gulp-rename");
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({advanced: true});
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return name + '.' + version + '.' + 'min';
};

gulp.task('js', function() {

  var bundler = browserify({
    entries: ['./assets/js/main.js'],
    debug: true
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/dist/js/'));
  };

  return bundle();
});

gulp.task('styles', function () {
  gulp.src('./assets/styles/main.less')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(less({
      plugins: [cleancss]
    }).on('error', util.log))
    .pipe(rename(getBundleName() + '.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/dist/css/'));
});

gulp.task('watch', function() {
    gulp.watch('./assets/styles/**/*.less', ['styles']);
    gulp.watch('./assets/js/**/*.js', ['js']);
});

gulp.task('serve', function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
      files: ["public/dist/**/*.*", "views/**/*.jade"],
      browser: "google chrome",
      port: 7000
  });
});

gulp.task('default', ['js', 'styles']);
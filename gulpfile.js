'use strict';

var gulp = require('gulp')
  , browserify = require('browserify')
  , exorcist = require('exorcist')
  , mold = require('mold-source-map')
  , source = require('vinyl-source-stream')
  , path = require('path')
  , mocha = require('gulp-mocha')
  , eslint = require('gulp-eslint')
  , pkg = require('./package.json')
  ;

var jsRoot = path.join(__dirname, 'lib')
  , libName = 'sockjs-' + pkg.version
  ;

gulp.task('test', function () {
  gulp.src('tests/node.js', {read: false})
    .pipe(mocha());
});

gulp.task('eslint', function () {
  gulp.src(['lib/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('watch', function () {
  gulp.watch('tests/*.js', ['test']);
});

gulp.task('testbundle', function() {
  return browserify('./lib/entry.js', {
      standalone: 'SockJS'
    , debug: true
    })
    .ignore('querystring')
    .bundle()
    .pipe(mold.transformSourcesRelativeTo(jsRoot))
    .pipe(exorcist(path.join(__dirname, 'tests/html/lib/sockjs.js.map')))
    .pipe(source('sockjs.js'))
    .pipe(gulp.dest('./tests/html/lib/'))
    ;
});

gulp.task('browserify', function () {
  return browserify('./lib/entry.js', {
      standalone: 'SockJS'
    , debug: true
    })
    .ignore('querystring')
    .bundle()
    .pipe(mold.transformSourcesRelativeTo(jsRoot))
    .pipe(exorcist(path.join(__dirname, 'build/sockjs.js.map')))
    .pipe(source('sockjs.js'))
    .pipe(gulp.dest('./build/'))
    ;
});

gulp.task('browserify:min', function () {
  return browserify('./lib/entry.js', {
      standalone: 'SockJS'
    })
    .ignore('querystring')
    .plugin('minifyify', {
      map: libName + '.min.js.map'
    , compressPath: jsRoot
    , output: './build/' + libName + '.min.js.map'
    })
    .bundle()
    .pipe(source(libName + '.min.js'))
    .pipe(gulp.dest('./build/'))
    ;
});

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');

gulp.task('js', function () {
  var b = browserify({
    entries: './static/js/src/main.js',
    debug: true,
    transform: ['babelify']
  });

  return b.bundle()
    .pipe(source('p4.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./static/js/'));
});

gulp.task('less', function() {
  return gulp.src('./static/css/less/p4.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./static/css/'));
});

gulp.task('lint', function() {
  return gulp.src('./static/js/src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jscs())
    .pipe(jscs.reporter())
});

gulp.task('build', ['lint', 'less', 'js']);

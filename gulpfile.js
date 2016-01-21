const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
const less = require('gulp-less');
const argv = require('yargs').argv;
const Server = require('karma').Server;
const del = require('del');
const cssnano = require('gulp-cssnano');

const isProduction = argv.production || false;

gulp.task('js', () => {
  var b = browserify({
    entries: './static/js/src/main.js',
    debug: !isProduction,
    transform: ['babelify']
  });
  var dest = gulp.dest('./static/bin/');
  var pipe = b.bundle()
    .pipe(source('p4.js'))
    .pipe(buffer());
  if (!isProduction) {
    return pipe
      .pipe(sourcemaps.init({
          loadMaps: true
        }))
      .pipe(sourcemaps.write())
      .pipe(dest);
  }
  return pipe
    .pipe(uglify())
    .pipe(dest);
});

gulp.task('less', () => {
  return gulp.src('./static/css/less/all.less')
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest('./static/bin/'))
});

gulp.task('lint', () => {
  return gulp.src([
        './static/js/src/**/*.js',
        './static/js/spec/**/*.js'
      ])
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('test', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('clean', () => {
  return del('./static/bin/**/*');
});

gulp.task('watch', () => {
  gulp.watch([
    'static/js/src/**/*.js',
    'static/js/spec/**/*.js',
    'static/css/less/*.less'
  ], ['build']);
});

gulp.task('build', [
  'lint',
  'test',
  'clean',
  'less',
  'js'
]);

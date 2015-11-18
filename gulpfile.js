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
const argv = require('yargs').argv;
const Server = require('karma').Server;

const isProduction = argv.production || false;

gulp.task('js', function () {
  var b = browserify({
    entries: './static/js/src/main.js',
    debug: !isProduction,
    transform: ['babelify']
  });
  var dest = gulp.dest('./static/js/');
  var pipe = b.bundle()
    .pipe(source('p4.js'))
    .pipe(buffer());
  if (!isProduction) {
    return pipe
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(dest);
  }
  return pipe
    .pipe(uglify())
    .pipe(dest);
});

gulp.task('less', function() {
  return gulp.src('./static/css/less/p4.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./static/css/'))
});

gulp.task('lint', function() {
  return gulp.src([
      './static/js/src/**/*.js',
      './static/js/spec/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('build', ['test', 'lint', 'less', 'js']);

gulp.task('watch', function() {
  gulp.watch([
    'static/js/src/**/*.js',
    'static/js/spec/**/*.js',
    'static/css/less/*.less'
  ], ['build']);
});

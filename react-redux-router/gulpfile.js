'use strict'

const gulp = require('gulp')
const gulpsync = require('gulp-sync')(gulp)
const gutil = require('gulp-util')
const browserSync = require('browser-sync').create()
const historyApiFallback = require('connect-history-api-fallback')
const sourcemaps = require('gulp-sourcemaps')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const browserify = require('browserify')
const watchify = require('watchify')
const babelify = require('babelify')
const envify = require('envify/custom')
const uglify = require('gulp-uglify')
const cssmin = require('gulp-cssnano')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const rimraf = require('rimraf')

gulp.task('serve', ['sass', 'babel:watch'], () => {
  browserSync.init({
    server: {
      baseDir: 'dev',
      middleware: [historyApiFallback()]
    },
    notify: false,
    open: false
  })

  gulp.watch('dev/stylesheets/src/**/*.scss', ['sass'])
  gulp.watch('dev/index.html').on('change', browserSync.reload)
})

gulp.task('sass', () => {
  return gulp.src('dev/stylesheets/src/manifest.scss')
    .pipe(rename('application.css'))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dev/stylesheets/'))
    .pipe(browserSync.stream())
})

gulp.task('babel', () => {
  return compileJSDev()
})

gulp.task('babel:watch', ['babel'], () => {
  return compileJSDev(true)
})

gulp.task('build:clean', (cb) => {
  rimraf('./dist', cb)
})

gulp.task('build:css', ['sass'], () => {
  return gulp.src('dev/stylesheets/*.css')
    .pipe(cssmin({keepSpecialComments: 0, inliner: {timeout: 20000}}))
    .pipe(gulp.dest('dist/stylesheets'))
})

gulp.task('build:html', () => {
  return gulp.src('dev/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
})

gulp.task('build:images', () => {
  return gulp.src('dev/assets/images/*')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/assets/images'))
})

gulp.task('build:js', () => {
  return compileJSProd()
})

gulp.task('develop', ['serve'])
gulp.task('default', ['develop'])
gulp.task('build', gulpsync.sync([
  'build:clean',
  ['build:css', 'build:html', 'build:images', 'build:js']
]))

function compileJSDev(watch) {
  const bundler = watchify(browserify('dev/javascripts/src/main.js', {debug: true}).transform(babelify))

  function rebundle() {
    bundler.bundle()
      .on('error', (err) => {
        gutil.log(gutil.colors.magenta('Browserify error:'), err)
      })
      .pipe(source('application.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dev/javascripts'))
      .pipe(browserSync.stream())
  }

  if (watch) {
    bundler.on('update', () => {
      gutil.log('Rebundling javascripts')
      rebundle()
    })
  }

  rebundle()
}

function compileJSProd() {
  const bundler = browserify('dev/javascripts/src/main.js', {debug: false, global: true})
    .transform(envify({
      global: true,
      _: 'purge',
      NODE_ENV: 'production'
    }))
    .transform(babelify)

  return bundler.bundle()
    .on('error', (err) => {
      gutil.log(gutil.colors.magenta('Browserify error:'), err)
    })
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/javascripts'))
}

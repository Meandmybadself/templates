const autoprefixer = require('gulp-autoprefixer')
const babelify = require('babelify')
const browserify = require('browserify')
const browserSync = require('browser-sync').create()
const buffer = require('vinyl-buffer')
const cssmin = require('gulp-clean-css')
const envify = require('envify/custom')
const gulp = require('gulp')
const gulpsync = require('gulp-sync')(gulp)
const htmlmin = require('gulp-minify-html')
const imagemin = require('gulp-imagemin')
const log = require('fancy-log')
const pngquant = require('imagemin-pngquant')
const rename = require('gulp-rename')
const rimraf = require('rimraf')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const watchify = require('watchify')

const DIR_SRC = 'dev'
const DIR_SRC_STYLESHEETS = `${DIR_SRC}/stylesheets`
const DIR_SRC_ASSETS = `${DIR_SRC}/assets`
const DIR_SRC_IMAGES = `${DIR_SRC_ASSETS}/images`

const DIR_DIST = 'dist'
const DIR_DIST_ASSETS = `${DIR_DIST}/assets`

gulp.task('serve', ['sass', 'babel:watch'], () => {
  log('Starting development task.')
  browserSync.init({
    server: {
      baseDir: 'dev'
    },
    open: false,
    notify: false
  })
  console.log('Browsersync initialized.')
  gulp.watch(`${DIR_SRC_STYLESHEETS}/src/*.scss`, ['sass'])
  gulp.watch(`${DIR_SRC}/*.html`).on('change', browserSync.reload)
})

// Turns SCSS into CSS
gulp.task('sass', () => {
  log(`Recompiling SASS in ${DIR_SRC_STYLESHEETS}/src/*.scss`)
  // Turn each top-level scss item in dev/stylesheets into CSS
  return gulp.src([`${DIR_SRC_STYLESHEETS}/src/*.scss`])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dev/stylesheets/'))
    .pipe(browserSync.stream({match: '**/*.css'}))
})

gulp.task('babel', () => {
  console.log('Babel task being called.')
  return compileDevJS()
})

gulp.task('babel:watch', ['babel'], () => {
  log('Watching JavaScript for changes.')
  return compileDevJS(true)
})

gulp.task('build:clean', (cb) => {
  rimraf(`${DIR_DIST}`, cb)
})

gulp.task('build:css', ['sass'], () => {
  return gulp.src('dev/stylesheets/*.css')
    .pipe(cssmin({keepSpecialComments: 0, inliner: {timeout: 20000}}))
    .pipe(gulp.dest(`${DIR_DIST}/stylesheets`))
})

gulp.task('build:html', () => {
  return gulp.src(`${DIR_SRC}/*.html`)
    .pipe(htmlmin())
    .pipe(gulp.dest(`${DIR_DIST}`))
})

gulp.task('build:images', () => {
  return gulp.src(`${DIR_SRC_IMAGES}/**.{jpg,png,gif,jpeg}`)
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(`${DIR_DIST_ASSETS}/images`))
})

gulp.task('build:js', () => {
  compileProdJS()
})

gulp.task('default', ['serve'])
gulp.task('build', gulpsync.sync([
  'build:clean',
  ['build:css', 'build:html', 'build:images', 'build:js']
]))

function compileDevJS (watch) {
  log('Compiling JavaScript.')
  const bundler = watchify(browserify(`${DIR_SRC}/javascripts/src/main.js`, {debug: true}))

  function rebundle () {
    bundler.bundle()
      .on('error', (err) => {
        log.error('Browserify error:', err)
      })
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${DIR_SRC}/javascripts`))
    .pipe(browserSync.stream())
  }

  if (watch) {
    bundler.on('update', () => {
      log('Rebundling javascripts')
      rebundle()
    })
  }
  rebundle()
}

function compileProdJS () {
  const bundler = browserify(`${DIR_SRC}/javascripts/src/main.js`, {debug: false, global: true})
    .transform(envify({
      global: true,
      _: 'purge',
      NODE_ENV: 'production'
    }))
    .transform(babelify)

    return bundler.bundle()
      .on('error', (err) => {
        log.error('Browserify error:', err)
      })
      .pipe(source(`${DIR_SRC}/javascripts/application.js`))
      .pipe(buffer())
      .pipe(uglify())
      .on('error', function (err) { log.error('[Error]', err.toString()) })
      .pipe(gulp.dest(`${DIR_DIST}/javascripts`))
}

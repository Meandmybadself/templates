'use strict'

const gulp = require('gulp') // Need main gulp to handle everything
const browserSync = require('browser-sync').create() // Create simple webserver with livereload on file change (Dont need this is running local webserver)
const sass = require('gulp-sass') // SASS to compile SCSS to CSS (Dont need this if using vanilla CSS)
const babel = require('gulp-babel') // Babel to transpile ES2015 JS (Dont need this if using vanilla JS)
const sourcemaps = require('gulp-sourcemaps') // Generate sourcemaps for compiled/transpiled code (Dont need this if dont care about sourcemaps)

gulp.task('serve', ['sass', 'babel'], () => {
  // Initialize BrowserSync webserver
  browserSync.init({
    server: {
      baseDir: 'dev' // Define web-root directory (https://www.browsersync.io/docs/options/#option-server)
    },
    open: false, // Don't automatically open web browser on start (https://www.browsersync.io/docs/options/#option-open)
    notify: false // Don't notifiy of file changes (https://www.browsersync.io/docs/options/#option-notify)
  })

  // Watch SCSS files for changes and run 'sass' task defined below
  gulp.watch('dev/stylesheets/src/**/*.scss', ['sass'])

  // Watch JS files for changes and run 'babel' task defined below
  gulp.watch('dev/javascripts/src/**/*.js', ['babel'])

  // Watch HTML files for changes and reload the browser
  gulp.watch('dev/**/*.html', browserSync.reload)

})

// Compile SCSS to CSS using SASS.
gulp.task('sass', () => {
  return gulp.src('dev/stylesheets/src/main.scss') // Only looks at main.scss which imports other partials as needed
    .pipe(sourcemaps.init()) // Initialize sourcemaps for CSS
    .pipe(sass()) // Run SASS, can specify options here if needed (https://github.com/dlmanning/gulp-sass#options)
    .pipe(sourcemaps.write('.')) // Write the CSS sourcemap to file
    .pipe(gulp.dest('dev/stylesheets')) // Write the CSS to file at this path
    .pipe(browserSync.stream()) // Stream updated CSS to browsersync if running, changes will show up automatically in browser
})

// Transpile ES2015 to ES5 using Babel (Babel options defined in package.json).
gulp.task('babel', () => {
  return gulp.src('dev/javascripts/src/**/*.js')
    .pipe(sourcemaps.init()) // Initialize sourcemaps for JS
    .pipe(babel()) // Run Babel, can specificy options here or in package.json (https://babeljs.io/docs/usage/options/)
    .pipe(sourcemaps.write('.')) // Write the JS soucemap to file
    .pipe(gulp.dest('dev/javascripts')) // Write the JS to file at this path
    .pipe(browserSync.stream()) // Stream updated JS to browsersync if running, changes will show up automatically in browser
})

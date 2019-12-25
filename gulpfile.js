const gulp = require('gulp')
const sass = require('gulp-sass')
const concatCss = require('gulp-concat-css')
const uglifyCss = require('gulp-uglifycss')
const sassGlob = require('gulp-sass-glob')
const jsonmin = require('gulp-jsonmin')
const browserSync = require('browser-sync').create()
const postCss = require('gulp-postcss')
const autoPrefixer = require('autoprefixer')
const cssVariables = require('postcss-css-variables')
const calc = require('postcss-calc')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const mozjpeg = require('imagemin-mozjpeg')
const gutil = require('gulp-util')
const ftp = require('vinyl-ftp')


// html
const srcHtmlPath = 'src/views/**/*.html'

// js
const srcUtilJsPath = 'src/assets/js'
const srcComponentsJsPath = 'src/assets/js/components/*.js'
const distJsPath = 'dist/assets/js'

// scss/css
const srcScssPath = 'src/assets/scss/style.scss'
const distCssPath = 'dist/assets/css'

// image
const srcImageRecursivePath = 'src/assets/image/**/*'
const distImagePath = 'dist/assets/image'

// production
const distProdPath = 'dist'
const distProdRecursivePath = 'dist/**/*'

// ftp
const ftpDestPath = '/public_html/www' // set yours

// data
const srcJsonDataPath = 'src/assets/data/**/*.json'
const distJsonDataPath = 'dist/assets/data/'

// service worker
const srcServiceWorkerPath = 'src/assets/js/service_worker'

// app manifest
const srcAppManifestPath = 'src'

// watch
const watchSrcHtmlPath = 'src/views/**/*.html'
const watchSrcScssPath = 'src/assets/scss/**/*.scss'
const watchSrcScriptsPath = 'src/assets/js/**/*.js'
const watchSrcImagePath = 'src/assets/image/**/*'
const watchSrcJsonDataPath = 'src/assets/data/**/*.json'
const watchSrcPwaPath = 'src/manifest.json'


// reload web browser
reload = (done) => {
  browserSync.reload()
  done()
}


// ...deploy with ftp
gulp.task('deploy', () => {

  const conn = ftp.create({
    host: 'localhost',
    port: 21,
    user: 'anonymous',
    password: 'anonymous',
    parallel: 1,
    maxConnections: 1,
    secure: false
  })

  const globs = [
    distProdRecursivePath
  ]

  return gulp.src(globs, {
      base: distProdPath + '/',
      buffer: false
    })
    .pipe(conn.newer(ftpDestPath)) // only upload newer files
    .pipe(conn.dest(ftpDestPath))
})


// serve http
gulp.task('serve',
  gulp.series((done) => {
    browserSync.init({
      server: {
        baseDir: distProdPath
      },
      notify: false
    })
    done()
  })
)


// ...minify html
gulp.task('html', () => {
  return gulp.src(srcHtmlPath)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      jsmin: true, // inline js
      cssmin: true // inline css
    }))
    .pipe(gulp.dest(distProdPath))
})


// ...minify/preprocess scss
gulp.task('sass', () => {
  return gulp.src(srcScssPath)
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'compressed' })
      .on('error', sass.logError))
    .pipe(postCss([autoPrefixer()]))
    .pipe(gulp.dest(distCssPath))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(rename('style-fallback.css'))
    .pipe(postCss([cssVariables(), calc()]))
    .pipe(gulp.dest(distCssPath))
})


// ...minify js (your custom scripts management)
gulp.task('pre-scripts', () => {
  return gulp.src([
      srcUtilJsPath + '/vendors/drift.js',
      srcUtilJsPath + '/util.js',
      srcComponentsJsPath
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(distJsPath))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(rename('scripts.pre.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distJsPath))
    .pipe(browserSync.reload({
      stream: true
    }))
})


// ...merge js (merge with compiler)
gulp.task('scripts', () => {
  return gulp.src([
      srcUtilJsPath + '/service_worker/krugurt+core.min.js',
      srcUtilJsPath + '/krunch+compiler.min.js',
      distJsPath + '/scripts.pre.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(distJsPath))
    .pipe(browserSync.reload({
      stream: true
    }))
})


// ...minify image
gulp.task('image', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [1, 1] }), // png
      mozjpeg({ quality: 100 }), // jpg
    ]))
    .pipe(gulp.dest(distImagePath))
})


// ...minify json
gulp.task('json', () => {
  return gulp.src(srcJsonDataPath)
    .pipe(jsonmin())
    .pipe(gulp.dest(distJsonDataPath))
})



// ...move json data
gulp.task('data', () => {
  return gulp.src(srcJsonDataPath)
    .pipe(gulp.dest(distJsonDataPath))
})


// ...move service worker
gulp.task('service-worker', () => {
  return gulp.src([
      srcServiceWorkerPath + '/krugurt+init.min.js',
      srcServiceWorkerPath + '/krugurt+sw.min.js'
    ])
    .pipe(gulp.dest(distProdPath))
})


// ...move app manifest
gulp.task('app-manifest', () => {
  return gulp.src([
      srcAppManifestPath + '/manifest.json',
    ])
    .pipe(gulp.dest(distProdPath))
})


// watch changes...
gulp.task('watch',
  gulp.series([

    // minify files
    'image',
    'pre-scripts',
    'scripts',
    'sass',
    'html',
    'json',
    // move files
    'data',
    'service-worker',
    'app-manifest',
    // host http
    'serve'

  ], () => {

    gulp.watch(watchSrcImagePath,
      gulp.series('image', reload))

    gulp.watch(watchSrcScriptsPath,
      gulp.series(['pre-scripts', 'scripts', reload]))

    gulp.watch(watchSrcScssPath,
      gulp.series(['sass', reload]))

    gulp.watch(watchSrcHtmlPath,
      gulp.series(['html', reload]))

    gulp.watch(watchSrcJsonDataPath,
      gulp.series('json', 'data', reload))

    gulp.watch(watchSrcPwaPath,
      gulp.series('app-manifest', reload))

  })

)

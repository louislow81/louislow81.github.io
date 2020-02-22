const autoPrefixer = require('autoprefixer')
const concatCss = require('gulp-concat-css')
const concat = require('gulp-concat')
const gulp = require('gulp')
const gutil = require('gulp-util')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const jsonmin = require('gulp-jsonmin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const postCss = require('gulp-postcss')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const serve = require('browser-sync').create()
const uglifyCss = require('gulp-uglifycss')
const uglify = require('gulp-uglify-es').default

const krugurtLibPath = 'libs'

const distJsPath = 'dist/assets/js'

const distProdPath = 'dist'
const distProdRecursivePath = 'dist/**/*'


// reload web browser
reload = (done) => {
  serve.reload()
  done()
}


// ...serve http
gulp.task('serve', gulp.series(function(done) {
  serve.init({
    server: {
      baseDir: distProdPath
    },
    notify: false
  })
  done()
}))


// ...minify html
const srcHtmlPath = 'src/views/**/*.html'
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
const srcScssPath = 'src/assets/scss/style.scss'
const distCssPath = 'dist/assets/css'
gulp.task('sass', () => {
  return gulp.src(srcScssPath)
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'compressed' })
      .on('error', sass.logError))
    .pipe(postCss([autoPrefixer()]))
    .pipe(gulp.dest(distCssPath))
    .pipe(serve.reload({
      stream: true
    }))
    .pipe(gulp.dest(distCssPath))
})


// ...minify js (your custom scripts management)
const srcComponentsJsPath = 'src/assets/js/components/*.js'
gulp.task('pre-scripts', () => {
  return gulp.src([
      krugurtLibPath + '/krunch+utility.js',
      srcComponentsJsPath
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(distJsPath))
    .pipe(serve.reload({
      stream: true
    }))
    .pipe(rename('scripts.pre.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distJsPath))
    .pipe(serve.reload({
      stream: true
    }))
})
// ...merge js (merge with compiler)
gulp.task('scripts', () => {
  return gulp.src([
      krugurtLibPath + '/krugurt+cache.min.js',
      krugurtLibPath + '/krunch+compiler.min.js',
      krugurtLibPath + '/krunch+router.min.js',
      // krugurtLibPath + '/krunch+locale.min.js',
      // krugurtLibPath + '/krunch+torrent.min.js',
      // krugurtLibPath + '/krunch+cerebrium.min.js',
      distJsPath + '/scripts.pre.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(distJsPath))
    .pipe(serve.reload({
      stream: true
    }))
})


const srcImageRecursivePath = 'src/assets/image/**/*'
const distLqImagePath = 'dist/assets/image/low'
const distHqImagePath = 'dist/assets/image/high'
// ...minify image (low quality)
gulp.task('image-low-quality', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [0.4, 0.4] }), // set png quality
      mozjpeg({ quality: 40 }), // set jpg quality
    ]))
    .pipe(gulp.dest(distLqImagePath))
})
// ...minify image (high quality)
gulp.task('image-high-quality', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [1, 1] }), // set png quality
      mozjpeg({ quality: 100 }), // set jpg quality
    ]))
    .pipe(gulp.dest(distHqImagePath))
})


// ...minify data
const srcJsonDataPath = 'src/assets/data/**/*.json'
const distJsonDataPath = 'dist/assets/data/'
gulp.task('data', () => {
  return gulp.src(srcJsonDataPath)
    .pipe(jsonmin())
    .pipe(gulp.dest(distJsonDataPath))
})


// ...minify locale
const srcLocalePath = 'src/assets/locale/**/*'
const distLocalePath = 'dist/assets/locale/'
gulp.task('locale', () => {
  return gulp.src(srcLocalePath)
    .pipe(jsonmin())
    .pipe(gulp.dest(distLocalePath))
})


// ...move service worker
const srcAppManifestPath = 'src/assets/pwa'
gulp.task('service-worker', () => {
  return gulp.src([
      krugurtLibPath + '/krugurt+init.min.js',
      krugurtLibPath + '/krugurt+sw.min.js'
    ])
    .pipe(gulp.dest(distProdPath))
})


// ...move app manifest
gulp.task('app-manifest', () => {
  return gulp.src([
      srcAppManifestPath + '/manifest.json'
    ])
    .pipe(gulp.dest(distProdPath))
})


// ...watch
const watchSrcHtmlPath = 'src/views/**/*.html'
const watchSrcScssPath = 'src/assets/scss/**/*.scss'
const watchSrcScriptsPath = 'src/assets/js/**/*.js'
const watchSrcImagePath = 'src/assets/image/**/*'
const watchSrcJsonDataPath = 'src/assets/data/**/*.json'
const watchSrcJsonLocalePath = 'src/assets/locale/**/*.json'
const watchSrcPwaPath = 'src/manifest.json'
gulp.task('watch', gulp.series([

    // minify files
    //'image-high-quality',
    //'image-low-quality',
    'pre-scripts',
    'scripts',
    'sass',
    'html',
    'data',
    // move files
    'service-worker',
    'locale',
    'app-manifest',
    // host http
    'serve'

  ], () => {

    gulp.watch(watchSrcImagePath,
      gulp.series('image-high-quality', reload))

    gulp.watch(watchSrcImagePath,
      gulp.series('image-low-quality', reload))

    gulp.watch(watchSrcScriptsPath,
      gulp.series(['pre-scripts', 'scripts', reload]))

    gulp.watch(watchSrcScssPath,
      gulp.series(['sass', reload]))

    gulp.watch(watchSrcHtmlPath,
      gulp.series(['html', reload]))

    gulp.watch(watchSrcJsonDataPath,
      gulp.series('data', reload))

    gulp.watch(watchSrcJsonLocalePath,
      gulp.series('locale', reload))

    gulp.watch(watchSrcPwaPath,
      gulp.series('app-manifest', reload))

  })

)

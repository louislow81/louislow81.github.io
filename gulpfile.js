const gulp = require('gulp')
const sass = require('gulp-sass')
const concatCss = require('gulp-concat-css')
const uglifyCss = require('gulp-uglifycss')
const sassGlob = require('gulp-sass-glob')
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

// watch
const watchSrcHtmlPath = 'src/views/**/*.html'
const watchSrcScssPath = 'src/assets/scss/**/*.scss'
const watchSrcScriptsPath = 'src/assets/js/**/*.js'
const watchSrcImagePath = 'src/assets/image/**/*'


// reload web browser
function reload(done) {
  browserSync.reload()
  done()
}


// ...for ftp
gulp.task('deploy',
  function() {

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
  }
)


// serve http
gulp.task('browserSync',
  gulp.series(function(done) {
    browserSync.init({
      server: {
        baseDir: distProdPath
      },
      notify: false
    })
    done()
  })
)


// ...for html
gulp.task('html',
  function() {
    return gulp.src(srcHtmlPath)
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        jsmin: true, // inline js
        cssmin: true // inline css
      }))
      .pipe(gulp.dest(distProdPath))
  }
)


// ...for scss
gulp.task('sass',
  function() {
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
  }
)


// ...for js
gulp.task('scripts',
  function() {
    return gulp.src([
        srcUtilJsPath + '/util.js',
        srcComponentsJsPath
      ])
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(distJsPath))
      .pipe(browserSync.reload({
        stream: true
      }))
      .pipe(rename('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(distJsPath))
      .pipe(browserSync.reload({
        stream: true
      }))
  }
)


// ...for proprietary library
gulp.task('proprietary',
  function() {
    return gulp.src([
        srcUtilJsPath + '/krunch+compiler.min.js'
      ])
      .pipe(gulp.dest(distJsPath))
  }
)


// ...for image
gulp.task('image',
  function() {
    return gulp.src(srcImageRecursivePath)
      .pipe(imagemin([
        pngquant({ quality: [1, 1] }), // png
        mozjpeg({ quality: 100 }), // jpg
      ]))
      .pipe(gulp.dest(distImagePath))
  }
)


// watch assets changes...
gulp.task('watch',
  gulp.series([

    'browserSync',
    'html',
    'sass',
    'scripts',
    'image',
    'proprietary',
    'deploy'

  ], function() {

    gulp.watch(watchSrcHtmlPath,
      gulp.series(['html', reload]))

    gulp.watch(watchSrcScssPath,
      gulp.series(['sass', reload]))

    gulp.watch(watchSrcScriptsPath,
      gulp.series(['scripts']))

    gulp.watch(watchSrcImagePath,
      gulp.series('image', reload))

  })

)

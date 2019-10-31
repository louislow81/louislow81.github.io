const gulp = require('gulp')
const sass = require('gulp-sass')
const concatCss = require('gulp-concat-css')
const uglifycss = require('gulp-uglifycss')
const sassGlob = require('gulp-sass-glob')
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssvariables = require('postcss-css-variables')
const calc = require('postcss-calc')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const mozjpeg = require('imagemin-mozjpeg')


// html file paths
const htmlFilesPath = 'src/views/**/*.html'
const htmlViewsPath = 'dist' // production-ready files

// js file paths
const utilJsPath = 'src/assets/js' // util.js path - you may need to update this if including the framework as external node module
const componentsJsPath = 'src/assets/js/components/*.js'
const scriptsJsPath = 'dist/assets/js' // folder for final scripts.js/scripts.min.js files

// scss/css file paths
const scssFilesPath = 'src/assets/scss/style.scss'
const cssPath = 'dist/assets/css' // folder for final style.css/style-custom-prop-fallback.css files

// image file paths
const imagePath = 'dist/assets/image' // folder for final optimized images


// reload web browser
function reload(done) {
  browserSync.reload()
  done()
}


// serve http
gulp.task('browserSync', gulp.series(function(done) {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false
  })
  done()
}))


// ...for html
gulp.task('html', function() {
  return gulp.src(htmlFilesPath)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      jsmin: true, // inline js
      cssmin: true // inline css
    }))
    .pipe(gulp.dest(htmlViewsPath))
})


// ...for scss
gulp.task('sass', function() {
  return gulp.src(scssFilesPath)
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(cssPath))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(rename('style-fallback.css'))
    .pipe(postcss([cssvariables(), calc()]))
    .pipe(gulp.dest(cssPath))
})


// ...for js
gulp.task('scripts', function() {
  return gulp.src([
      utilJsPath + '/util.js',
      componentsJsPath
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(scriptsJsPath))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsJsPath))
    .pipe(browserSync.reload({
      stream: true
    }))
})


// ...for proprietary library
gulp.task('proprietary', function() {
  return gulp.src([
      utilJsPath + '/krunch+compiler.min.js'
    ])
    .pipe(gulp.dest(scriptsJsPath))
})


// ...for image
gulp.task('image', function() {
  return gulp.src('src/assets/image/**/*')
    .pipe(imagemin([
      pngquant({ quality: [1, 1] }), // png
      mozjpeg({ quality: 100 }), // jpg
    ]))
    .pipe(gulp.dest(imagePath))
})


// watch those assets changes...
gulp.task('watch', gulp.series([
  'browserSync', 
  'html', 
  'sass', 
  'scripts', 
  'image', 
  'proprietary'
  ], function() {
  gulp.watch('src/views/**/*.html', gulp.series(['html', reload]))
  gulp.watch('src/assets/scss/**/*.scss', gulp.series(['sass', reload]))
  gulp.watch('src/assets/js/**/*.js', gulp.series(['scripts']))
  gulp.watch('src/assets/image/**/*', gulp.series('image', reload))
}))

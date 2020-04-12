const autoPrefixer = require('autoprefixer')
const clean = require('gulp-clean')
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
const purgeCss = require('gulp-purgecss')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const serve = require('browser-sync').create()
const uglifyCss = require('gulp-uglifycss')
const uglify = require('gulp-uglify-es').default
const webp = require('gulp-webp')

const krugurtFrameworkPath = 'framework'

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
const srcScssPath = 'src/assets/scss/base.scss'
const srcFontsPath = 'src/assets/scss/fonts'
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
// ...bundle with Yogurt
gulp.task('css', () => {
  return gulp.src([
      srcFontsPath + '/fonts.css',
      krugurtFrameworkPath + '/yogurt.min.css',
      distCssPath + '/base.css'
    ])
    .pipe(concat('style_merged.css'))
    .pipe(gulp.dest(distCssPath))
    .pipe(serve.reload({
      stream: true
    }))
})


// ...bundle your custom js
const srcAppJsPath = 'src/views'
const srcComponentsJsPath = 'src/assets/js/components/*.js'
gulp.task('pre-scripts', () => {
  return gulp.src([
      srcComponentsJsPath,
      srcAppJsPath + '/app.js' // default bundle
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
// ...bundle krunch files (disable only the `OPTIONAL`)
gulp.task('scripts', () => {
  return gulp.src([
      // CORE: persistent cache service worker
      krugurtFrameworkPath + '/krugurt+cache.min.js',
      // CORE: html view compiler
      krugurtFrameworkPath + '/krunch+compiler.min.js',
      // OPTIONAL: isomorphic router
      krugurtFrameworkPath + '/krunch+router.min.js',
      // OPTIONAL: localization
      // krugurtFrameworkPath + '/krunch+locale.min.js',
      // OPTIONAL: streaming file with torrent network
      // krugurtFrameworkPath + '/krunch+torrent.min.js',
      // OPTIONAL: sigmoid neural network
      // krugurtFrameworkPath + '/krunch+cerebrium.min.js',
      // CORE: build-in utilities api
      krugurtFrameworkPath + '/krunch+utility.js',
      distJsPath + '/scripts.pre.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(distJsPath))
    .pipe(serve.reload({
      stream: true
    }))
})


const srcImageRecursivePath = 'src/assets/image/**/*'
const distLqImagePath = 'dist/assets/image/low'
const distHqImagePath = 'dist/assets/image/high'
// ...non-WebP format
gulp.task('image-low-quality', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [0.6, 0.6] }), // set png quality
      mozjpeg({ quality: 60 }), // set jpg quality
    ]))
    .pipe(gulp.dest(distLqImagePath))
})
gulp.task('image-high-quality', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [1, 1] }), // set png quality
      mozjpeg({ quality: 100 }), // set jpg quality
    ]))
    .pipe(gulp.dest(distHqImagePath))
})
// ...WebP format
gulp.task('webp-low-quality', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(webp({ quality: 60 })) // set webp quality
    .pipe(gulp.dest(distLqImagePath))
});
gulp.task('webp-high-quality', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(webp({ quality: 100 })) // set webp quality
    .pipe(gulp.dest(distHqImagePath))
});


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
      krugurtFrameworkPath + '/krugurt+init.min.js',
      krugurtFrameworkPath + '/krugurt+sw.min.js'
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


// ...purge unused css
gulp.task('purge-css', () => {
  return gulp.src(distCssPath + '/style_merged.css')
    .pipe(purgeCss({
        content: [
          'src/views/**/**/**/**/**/**/*.html',
          'src/assets/data/**/**/**/**/*.json'
        ],
        // make compatible for `Yogurt CSS framework`
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        whitelistPatterns: [/-webkit-scrollbar-thumb$/]
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(distCssPath))
})


// ...remove artifact files
gulp.task('remove-js', () => {
  return gulp.src([
  './framework/.git',
  distProdPath + '/assets/js/scripts.js',
  distProdPath + '/assets/js/scripts.pre.js'
  ], {
    read: false,
    allowEmpty: true
  })
  .pipe(clean())
})
gulp.task('remove-css', () => {
  return gulp.src([
  './framework/.git',
  distProdPath + '/assets/css/base.css',
  distProdPath + '/assets/css/style_merged.css'
  ], {
    read: false,
    allowEmpty: true
  })
  .pipe(clean())
})


// ...watch
const watchSrcAppPath = 'src/views/**/*.js'
const watchSrcHtmlPath = 'src/views/**/*.html'
const watchSrcScssPath = 'src/assets/scss/**/*.scss'
const watchSrcScriptsPath = 'src/assets/js/**/*.js'
const watchSrcImagePath = 'src/assets/image/**/*'
const watchSrcJsonDataPath = 'src/assets/data/**/*.json'
const watchSrcJsonLocalePath = 'src/assets/locale/**/*.json'
const watchSrcPwaPath = 'src/manifest.json'
gulp.task('watch', gulp.series([

    'pre-scripts',
    'scripts',
    'sass',
    'css',
    'purge-css',
    'html',
    'data',
    'service-worker',
    'locale',
    'app-manifest',
    'serve'

  ], () => {

    gulp.watch(watchSrcImagePath,
      gulp.series([
        'image-high-quality',
        //'webp-high-quality',
        reload
      ])
    )

    gulp.watch(watchSrcImagePath,
      gulp.series([
        'image-low-quality',
        //'webp-low-quality',
        reload
      ])
    )

    gulp.watch(watchSrcScriptsPath,
      gulp.series([
        'pre-scripts',
        'scripts',
        reload
      ])
    )

    gulp.watch(watchSrcAppPath,
      gulp.series([
        'pre-scripts',
        'scripts',
        reload
      ])
    )

    gulp.watch(watchSrcScssPath,
      gulp.series([
        'sass',
        'css',
        'purge-css',
        reload
      ])
    )

    gulp.watch(watchSrcHtmlPath,
      gulp.series([
        'html',
        'purge-css',
        reload
      ])
    )

    gulp.watch(watchSrcJsonDataPath,
      gulp.series([
        'data',
        reload
      ])
    )

    gulp.watch(watchSrcJsonLocalePath,
      gulp.series([
        'locale',
        reload
      ])
    )

    gulp.watch(watchSrcPwaPath,
      gulp.series([
        'app-manifest',
        reload
      ])
    )

  })
)

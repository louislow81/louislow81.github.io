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
const version = require('gulp-version-number')
const gulpLoadPlugins = require('gulp-load-plugins')
const inject = gulpLoadPlugins()

const frameworkPath = 'framework'
const distJsPath = 'dist/assets/js'
const distProdPath = 'dist'
const distProdRecursivePath = 'dist/**/*'


// reload web browser
reload = (done) => {
  serve.reload()
  done()
}

gulp.task('serve', gulp.series(function(done) {
  serve.init({
    server: {
      baseDir: distProdPath
    },
    notify: false
  })
  done()
}))


gulp.task('build-html', () => {
  const versionConfig = {
    'value': '%MDS%', // using MDS hash
    'append': { 'key': 'v', 'to': ['css', 'js'] }
  }
  const srcHtmlPath = 'src/views/**/**/**/**/*.html'
  return gulp.src(srcHtmlPath)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      jsmin: true, // inline js
      cssmin: true // inline css
    }))
    // inject versioning to (css,js) static assets
    .pipe(inject.versionNumber(versionConfig))
    .pipe(gulp.dest(distProdPath))
})


const srcScssPath = 'src/assets/scss/base.scss'
const srcFontsPath = 'src/assets/scss/fonts'
const distCssPath = 'dist/assets/css'
gulp.task('build-sass', () => {
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
gulp.task('bundle-css', () => {
  return gulp.src([
      srcFontsPath + '/fonts.css',
      frameworkPath + '/yogurt.min.css',
      distCssPath + '/base.css'
    ])
    .pipe(concat('style_merged.css'))
    .pipe(gulp.dest(distCssPath))
    .pipe(serve.reload({
      stream: true
    }))
})


gulp.task('build-js', () => {
  const srcAppJsPath = 'src/views'
  const srcComponentsJsPath = 'src/assets/js/components/*.js'
  return gulp.src([
      srcAppJsPath + '/app.js', // default bundle
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
gulp.task('bundle-js', () => {
  return gulp.src([
      // CORE: persistent cache service worker
      frameworkPath + '/krugurt+cache.min.js',
      // CORE: html view compiler
      frameworkPath + '/krunch+compiler.min.js',
      // OPTIONAL: isomorphic router
      // frameworkPath + '/krunch+router.min.js',
      // OPTIONAL: localization
      // frameworkPath + '/krunch+locale.min.js',
      // OPTIONAL: streaming file with torrent network
      // frameworkPath + '/krunch+torrent.min.js',
      // OPTIONAL: sigmoid neural network
      // frameworkPath + '/krunch+cerebrium.min.js',
      // CORE: build-in utilities api
      frameworkPath + '/krunch+utility.js',
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
gulp.task('move-image-low', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(gulp.dest(distLqImagePath))
})
gulp.task('move-image-high', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(gulp.dest(distHqImagePath))
})
gulp.task('optimize-image-low', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [0.5, 0.5] }), // set png quality
      mozjpeg({ quality: 50 }), // set jpg quality
    ]))
    .pipe(gulp.dest(distLqImagePath))
})
gulp.task('optimize-image-high', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(imagemin([
      pngquant({ quality: [0.9, 0.9] }), // set png quality
      mozjpeg({ quality: 90 }), // set jpg quality
    ]))
    .pipe(gulp.dest(distHqImagePath))
})
gulp.task('optimize-webp-low', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(webp({ quality: 50 })) // set webp quality
    .pipe(gulp.dest(distLqImagePath))
});
gulp.task('optimize-webp-high', () => {
  return gulp.src(srcImageRecursivePath)
    .pipe(webp({ quality: 90 })) // set webp quality
    .pipe(gulp.dest(distHqImagePath))
});


gulp.task('build-data', () => {
  const srcJsonDataPath = 'src/assets/data/**/*.json'
  const distJsonDataPath = 'dist/assets/data/'
  return gulp.src(srcJsonDataPath)
    .pipe(jsonmin())
    .pipe(gulp.dest(distJsonDataPath))
})


gulp.task('build-locale', () => {
  const srcLocalePath = 'src/assets/locale/**/*'
  const distLocalePath = 'dist/assets/locale/'
  return gulp.src(srcLocalePath)
    .pipe(jsonmin())
    .pipe(gulp.dest(distLocalePath))
})


const srcAppManifestPath = 'src/assets/pwa'
gulp.task('move-service-worker', () => {
  return gulp.src([
      frameworkPath + '/krugurt+init.min.js',
      frameworkPath + '/krugurt+sw.min.js'
    ])
    .pipe(gulp.dest(distProdPath))
})
gulp.task('move-app-manifest', () => {
  return gulp.src([
      srcAppManifestPath + '/manifest.json'
    ])
    .pipe(gulp.dest(distProdPath))
})
gulp.task('build-app-manifest', () => {
  return gulp.src([
      srcAppManifestPath + '/manifest.json'
    ])
    .pipe(jsonmin())
    .pipe(gulp.dest(distProdPath))
})

gulp.task('move-css', () => {
  return gulp.src(distCssPath + '/style_merged.css')
    .pipe(rename('style.css'))
    .pipe(gulp.dest(distCssPath))
})

gulp.task('move-404', () => {
  return gulp.src([
      'src/views/404.html',
    ])
    .pipe(gulp.dest(distProdPath))
})

gulp.task('purge-css', () => {
  return gulp.src(distCssPath + '/style_merged.css')
    .pipe(purgeCss({
      content: [
        'src/**/**/**/**/**/*.html',
        'src/assets/js/**/**/**/**/*.js',
        'src/assets/data/**/**/**/**/*.json'
      ],
      // make compatible for `Yogurt CSS` framework
      defaultExtractor: content => content.match(/[\w-/:()]+(?<!:)/g) || [],
      whitelistPatterns: [/-webkit-scrollbar-thumb$/]
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(distCssPath))
})

gulp.task('remove-junk-js', () => {
  return gulp.src([
      distProdPath + '/assets/js/scripts.js',
      distProdPath + '/assets/js/scripts.pre.js'
    ], {
      read: false,
      allowEmpty: true
    })
    .pipe(clean())
})

gulp.task('remove-junk-css', () => {
  return gulp.src([
      distProdPath + '/assets/css/base.css',
      distProdPath + '/assets/css/style_merged.css'
    ], {
      read: false,
      allowEmpty: true
    })
    .pipe(clean())
})

gulp.task('move-pdf-resume', () => {
  const srcPdfResumePath = 'src/assets/pdf'
  return gulp.src([
      srcPdfResumePath + '/*.pdf'
    ])
    .pipe(gulp.dest(distProdPath + '/assets/pdf/'))
})

gulp.task('production', gulp.series(
  'build-js',
  'bundle-js',
  'build-sass',
  'bundle-css',
  'purge-css',
  'build-html',
  'build-data',
  'build-locale',
  'optimize-image-low',
  'optimize-image-high',
  'move-service-worker',
  'build-app-manifest',
  'move-pdf-resume',
  'move-404',
  'remove-junk-js',
  'remove-junk-css'
))


gulp.task('development', gulp.series([

  'build-js',
  'bundle-js',
  'build-sass',
  'bundle-css',
  'move-css',
  'build-html',
  'build-data',
  'build-locale',
  'move-image-low',
  'move-image-high',
  'move-service-worker',
  'move-app-manifest',
  'move-pdf-resume',
  'move-404',
  'serve'

], () => {

  const watchSrcImagePath = 'src/assets/image/**/*'
  gulp.watch(watchSrcImagePath,
    gulp.series([
      'move-image-high',
      //'move-webp-high',
      reload
    ])
  )

  gulp.watch(watchSrcImagePath,
    gulp.series([
      'move-image-low',
      //'move-webp-low',
      reload
    ])
  )

  const watchSrcScriptsPath = 'src/assets/js/**/*.js'
  gulp.watch(watchSrcScriptsPath,
    gulp.series([
      'build-js',
      'bundle-js',
      reload
    ])
  )

  const watchSrcAppPath = 'src/views/**/*.js'
  gulp.watch(watchSrcAppPath,
    gulp.series([
      'build-js',
      'bundle-js',
      reload
    ])
  )

  const watchSrcScssPath = 'src/assets/scss/**/*.scss'
  gulp.watch(watchSrcScssPath,
    gulp.series([
      'build-sass',
      'bundle-css',
      'move-css',
      reload
    ])
  )

  const watchSrcHtmlPath = 'src/**/**/**/**/**/*.html'
  gulp.watch(watchSrcHtmlPath,
    gulp.series([
      'build-html',
      'move-css',
      'move-404',
      reload
    ])
  )

  const watchSrcJsonDataPath = 'src/assets/data/**/*.json'
  gulp.watch(watchSrcJsonDataPath,
    gulp.series([
      'build-data',
      reload
    ])
  )

  const watchSrcJsonLocalePath = 'src/assets/locale/**/*.json'
  gulp.watch(watchSrcJsonLocalePath,
    gulp.series([
      'build-locale',
      reload
    ])
  )

  const watchSrcPwaPath = 'src/manifest.json'
  gulp.watch(watchSrcPwaPath,
    gulp.series([
      'move-app-manifest',
      reload
    ])
  )

}))


'use strict'

import babel from 'gulp-babel'
import browserReporter from 'postcss-browser-reporter'
import browserSync from 'browser-sync'
import concat from 'gulp-concat'
import cssMqpacker from 'css-mqpacker'
import cssNext from 'postcss-cssnext'
import csso from 'postcss-csso'
import fontMagician from 'postcss-font-magician'
import gulp from 'gulp'
import gutil from 'gulp-util'
import imageOp from 'gulp-image-optimization'
import inlineSVG from 'postcss-inline-svg'
import cssImport from 'postcss-import'
import postcss from 'gulp-postcss'
import reporter from 'postcss-reporter'
import responsiveType from 'postcss-responsive-type'
import pug from 'gulp-pug'
import short from 'postcss-short'
import sourcemaps from 'gulp-sourcemaps'
import stylelint from 'stylelint'
import svgo from 'postcss-svgo'
import uncss from 'postcss-uncss'
import uglify from 'gulp-uglify'

gulp.task('watch', () => {
  gulp.watch('src/pug/**', gulp.series('pug'))
  gulp.watch('src/postcss/**', gulp.series('postcss'))
  gulp.watch('src/es6/**', gulp.series('es6'))
})

// Pug

gulp.task('pug', () => {
  return gulp.src('src/pug/index.pug')
  .pipe(sourcemaps.init())
  .pipe(pug({
    pretty: false
  }).on('error', gutil.log))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/'))
  .pipe(browserSync.stream())
})

// PostCSS

gulp.task('postcss', () => {
  const processors = [
    stylelint('./.stylelintrc'),
    cssImport({
      plugins: [
        uncss({
          html: ['./dist/index.html']
        })
      ]
    }),
    responsiveType,
    short({
      'border': {
        disable: true
      },
      'color': {
        disable: true
      },
      'font-weight': {
        disable: true
      }
    }),
    inlineSVG,
    svgo,
    fontMagician,
    cssNext({
      autoprefixer: ['ie >= 10', '> 2% in RU']
    }),
    cssMqpacker,
    browserReporter({
      selector: 'body:before'
    }),
    reporter,
    csso
  ]
  return gulp.src('./src/postcss/style.css')
  .pipe(sourcemaps.init())
  .pipe(postcss(processors).on('error', gutil.log))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/css/'))
  .pipe(browserSync.stream())
})

// JavaScript

gulp.task('es6', () => {
  return gulp.src([
    './src/es6/subtitles-parser.es6',
    './src/es6/main.es6',
    './src/es6/playbutton.es6',
    './src/es6/grayscale.es6',
    './src/es6/scratch.es6',
    './src/es6/subtitles.es6'
  ])
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat('main.js'))
  .pipe(uglify({
    mangle: true
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/js/'))
  .pipe(browserSync.stream())
})

// Images

gulp.task('images', (cb) => {
  gulp.src(['src/images/**/*'])
  .pipe(imageOp({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb)
})

// Server

gulp.task('stream', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: true
  })
})

gulp.task('default', gulp.series('pug', 'postcss', 'es6', gulp.parallel('stream', 'watch')))

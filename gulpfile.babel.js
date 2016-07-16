'use strict'

import browserReporter from 'postcss-browser-reporter'
import browserSync from 'browser-sync'
import cssMqpacker from 'css-mqpacker'
import cssNext from 'postcss-cssnext'
import csso from 'postcss-csso'
import gulp from 'gulp'
import imageOp from 'gulp-image-optimization'
import cssImport from 'postcss-import'
import postcss from 'gulp-postcss'
import reporter from 'postcss-reporter'
import responsiveType from 'postcss-responsive-type'
import pug from 'gulp-pug'
import short from 'postcss-short'
import stylelint from 'stylelint'
import uncss from 'postcss-uncss'

gulp.task('default', ['server'], () => {
  gulp.watch('src/pug/**', (event) => {
    gulp.run('pug')
  })
  gulp.watch('src/postcss/**', (event) => {
    gulp.run('postcss')
  })
  gulp.watch('src/js/**', (event) => {
    gulp.run('js')
  })
})

gulp.task('build', () => {
  gulp.run('pug', 'postcss', 'images', 'move')
})

// Pug

gulp.task('pug', () => {
  gulp.src('src/pug/index.pug')
    .pipe(pug({
      pretty: false
    }))
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
  return gulp.src('src/postcss/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css/'))
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

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: true
  })
})

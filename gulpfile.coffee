gulp = require('gulp')
concat = require('gulp-concat')
coffee = require('gulp-coffee')
stylus = require('gulp-stylus')
order = require('gulp-order')
iff = require('gulp-if')
jade = require('gulp-jade')
coffeelint = require('gulp-coffeelint')
uglifycss = require('gulp-minify-css')
uglifyjs = require('gulp-uglify')
filter = require('gulp-filter')
bower = require('main-bower-files')
args = require('yargs').argv

jsFilter = filter('*.js')
cssFilter = filter('*.css')

gulp.task 'coffee', ->
  gulp.src([
    './app/js/vector.coffee',
    './app/js/point.coffee',
    './app/js/circle.coffee',
    './app/js/quadrant.coffee'
    './app/js/app.coffee'
  ])
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
  .pipe(coffee({bare: true}).on('error', ->))
  .pipe(iff(args.p or args.production, uglifyjs()))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./public/js'))

gulp.task 'stylus', ->
  gulp.src('./app/css/*.styl')
  .pipe(stylus())
  .pipe(iff(args.p or args.production, uglifycss()))
  .pipe(concat('app.css'))
  .pipe(gulp.dest('./public/css'))

gulp.task 'jade', ->
  gulp.src('./app/**/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./public/'))

gulp.task 'bower', ->
  gulp.src(bower())
  .pipe(jsFilter)
  .pipe(iff(args.p or args.production, uglifyjs()))
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./public/js'))
  .pipe(jsFilter.restore())
  .pipe(cssFilter)
  .pipe(iff(args.p or args.production, uglifycss()))
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./public/css'))

gulp.task 'build', ['bower', 'coffee', 'stylus', 'jade']

gulp.task 'watch', ->
  gulp.run('build')
  gulp.watch('./app/js/*.coffee', ['coffee'])
  gulp.watch('./app/css/*.styl', ['stylus'])
  gulp.watch('./app/**/*.jade', ['jade'])
  gulp.watch('./bower_components/*', ['bower'])
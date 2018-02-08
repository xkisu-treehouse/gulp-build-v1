'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');
const rename = require('gulp-rename');

const options = {
    dist: './dist'
}

gulp.task('scripts', function() {
    return gulp.src('./js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(options.dist + '/scripts'));
});

gulp.task('styles', function() {
    return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename('all.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(options.dist + '/styles'))
        .pipe(connect.reload());
});

gulp.task('images', function() {
    return gulp.src('./images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/content'));
});

gulp.task('html', function () {
    gulp.src('./*.html')
      .pipe(gulp.dest(options.dist))
});

gulp.task('clean', function() {
    return del('dist/**', {force:true});
});

gulp.task('build', function (done) {
    runSequence('clean', 'scripts', 'styles', 'images', 'html', function() {
        done();
    });
});

gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['styles']);
});


gulp.task('connect', function() {
	connect.server({
        port: 8080,
        livereload: true,
        root: 'dist',
    });
    gulp.start('watch')
});

gulp.task('default', ['build'], function(){
    gulp.start('connect');
});
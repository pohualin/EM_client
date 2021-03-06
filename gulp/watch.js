'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('watch', ['wiredep', 'client-styles', 'admin-styles'], function () {
    gulp.watch('app/styles/theme/client/*.scss', ['client-styles']);
    gulp.watch('app/styles/theme/admin/*.scss', ['admin-styles']);
    gulp.watch('app/admin-facing/scripts/**/*.js', ['admin-scripts']);
    gulp.watch('app/client-facing/**/*.js', ['client-scripts']);
    gulp.watch('app/app-router/**/*.js', ['router-scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});

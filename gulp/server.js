'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

/* This configuration allow you to configure browser sync to proxy your backend */
var proxyTarget = 'http://localhost:8080'; // The location of your backend

var proxy = httpProxy.createProxyServer({
    target: proxyTarget
});

function proxyMiddleware(req, res, next) {
    if (req.url.indexOf('webapi') !== -1 ||
        req.url.indexOf('api-docs') !== -1 ||
        req.url.indexOf('webapi-client') !== -1) {
        proxy.web(req, res);
    } else {
        next();
    }
}

function browserSyncInit(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;

    browserSync({
        files: files || '*',
        startPath: '/index.html',
        ghostMode: false,
        server: {
            baseDir: baseDir,
            middleware: proxyMiddleware
        },
        browser: browser
    });

}

gulp.task('serve', ['watch'], function () {
    browserSyncInit([
        'app',
        '.tmp'
    ], [
        '.tmp/styles/**/*.css',
        'app/**/*.js',
        'app/**/*.html',
        'app/images/**/*'
    ]);
});

gulp.task('serve:dist', function () {
    browserSyncInit('dist');
});

gulp.task('serve:build-dist', ['build'], function () {
    browserSyncInit('dist');
});

gulp.task('serve:e2e', function () {
    browserSyncInit(['app', '.tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
    browserSyncInit('dist', null, []);
});

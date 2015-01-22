'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

/* This configuration allow you to configure browser sync to proxy your backend */
var proxyTarget = 'http://localhost:8080'; // The location of your backend
var proxyApiPrefix = 'webapi'; // The element in the URL which differentiate between API request and static file request

var proxy = httpProxy.createProxyServer({
    target: proxyTarget
});

function proxyMiddleware(req, res, next) {
    if (req.url.indexOf(proxyApiPrefix) !== -1 ||
        req.url.indexOf('api-docs') !== -1 ||
        req.url.indexOf('webapi-client') !== -1) {
        proxy.web(req, res);
    } else {
        next();
    }
}

function browserSyncInit(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;

    browserSync.init(files, {
        startPath: '/index.html',
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

gulp.task('serve:dist', ['build'], function () {
    browserSyncInit('dist');
});

gulp.task('serve:e2e', function () {
    browserSyncInit(['app', '.tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
    browserSyncInit('dist', null, []);
});

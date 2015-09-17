'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var maven = require('gulp-maven-deploy');
var mainBowerFiles = require('main-bower-files');

gulp.task('styles', function () {
    return gulp.src('app/styles/**/main.scss')
        .pipe($.rubySass({ style: 'expanded', sourcemap: true }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.sourcemaps.write({
          includeContent: false,
          sourceRoot: '/app'
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('app/styles'))
        .pipe($.size({title: 'styles', showFiles:true}));
});

gulp.task('admin-scripts', function () {
    return gulp.src('app/admin-facing/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe($.size({title: 'admin facing scripts', showFiles:true}));
});

gulp.task('client-scripts', function () {
    return gulp.src('app/client-facing/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe($.size({title: 'client facing scripts', showFiles:true}));
});

gulp.task('router-scripts', function () {
    return gulp.src('app/app-router/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe($.size({title: 'app router scripts', showFiles:true}));
});

gulp.task('admin-partials', function () {
    return gulp.src('app/admin-facing/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'emmiManager',
            prefix: 'admin-facing/'
        }))
        .pipe(gulp.dest('.tmp/partials'))
        .pipe($.size({title: 'admin partials', showFiles:true}));
});

gulp.task('client-partials', function () {
    return gulp.src('app/client-facing/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'emmiManager',
            prefix: 'client-facing/'
        }))
        .pipe(gulp.dest('.tmp/client-partials'))
        .pipe($.size({title: 'client-partials', showFiles: true}));
});

gulp.task('router-partials', function () {
    return gulp.src('app/app-router/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'emmiRouter',
            prefix: 'app-router/'
        }))
        .pipe(gulp.dest('.tmp/router-partials'))
        .pipe($.size({title: 'router-partials', showFiles: true}));
});

gulp.task('html', ['styles', 'admin-scripts', 'client-scripts', 'router-scripts', 'admin-partials', 'client-partials', 'router-partials', 'styleguide'],
    function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
        var assets = $.useref.assets();
    return gulp.src(['app/*.html','app/styleguide/*.html'], { base: 'app' })
        .pipe($.inject(gulp.src('.tmp/partials/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../'
        }))
        .pipe($.inject(gulp.src('.tmp/client-partials/**/*.js'), {
            read: false,
            starttag: '<!-- inject:client-partials -->',
            addRootSlash: false,
            addPrefix: '../'
        }))
        .pipe($.inject(gulp.src('.tmp/router-partials/**/*.js'), {
            read: false,
            starttag: '<!-- inject:router-partials -->',
            addRootSlash: false,
            addPrefix: '../'
        }))
        .pipe(assets)
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html', showFiles:true}));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images', showFiles:true}));
});

gulp.task('favicon', function () {
    return gulp.src('app/favicon.ico')
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'app fonts', showFiles:true})),
        gulp.src(mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'bower fonts', showFiles:true}));
});

gulp.task('font-paths', ['html'], function () {
    return gulp.src('dist/styles/**/*.css')
        .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '/fonts/'))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('translations', function () {
    return gulp.src('app/i18n/**/*')
        .pipe(gulp.dest('dist/i18n')),
        gulp.src('app/bower_components/angular-i18n/*.js')
        .pipe(gulp.dest('dist/bower_components/angular-i18n'));
});

gulp.task('api-docs', function () {
    return gulp.src('app/swagger-ui/**/*')
        .pipe(gulp.dest('dist/swagger-ui')),
        gulp.src('app/bower_components/swagger-ui/dist/**/*')
            .pipe(gulp.dest('dist/bower_components/swagger-ui/dist'));
});

gulp.task('hologram', function () {
    return gulp.src('hologram_config.yml')
        .pipe($.hologram({logging:true}));
});

gulp.task('styleguide', ['hologram'], function () {
    // Make sure Hologram has built before moving assets
    return gulp.src('app/styleguide/theme-build/**/*')
        .pipe(gulp.dest('dist/styleguide/theme-build'));
});

gulp.task('deploy-snapshot', function () {
    gulp.src('.')
        .pipe(maven.deploy({
            'config': {
                'groupId': 'com.emmisolutions.emmimanager',
                'finalName': '{name}-{version}',
                'type': 'jar',
                'repositories': [
                    {
                        'id': 'emmi-snapshots',
                        'url': 'https://build1.emmisolutions.com/nexus/content/repositories/snapshots/'
                    }
                ]
            }
        }))
});

gulp.task('deploy-release', function () {
    gulp.src('.')
        .pipe(maven.deploy({
            'config': {
                'groupId': 'com.emmisolutions.emmimanager',
                'finalName': '{name}-{version}',
                'type': 'jar',
                'repositories': [
                    {
                        'id': 'emmi-releases',
                        'url': 'https://build1.emmisolutions.com/nexus/content/repositories/releases/'
                    }
                ]
            }
        }))
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist', 'app/styleguide'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'favicon', 'fonts', 'font-paths', 'translations', 'api-docs']);

'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({ style: 'expanded' }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles', showFiles:true}));
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        // .pipe($.jshint.reporter('fail'))
        .pipe($.size({title: 'scripts', showFiles:true}));
});

gulp.task('partials', function () {
    return gulp.src('app/partials/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: "emmiManager",
            prefix: "partials/"
        }))
        .pipe(gulp.dest(".tmp/partials"))
        .pipe($.size({title: 'partials', showFiles:true}));
});

gulp.task('html', ['styles', 'scripts', 'partials'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.inject(gulp.src('.tmp/partials/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../'
        }))
        .pipe($.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngmin())
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
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
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'fonts', showFiles:true}));
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

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'partials', 'images', 'favicon', 'fonts', 'translations', 'api-docs']);

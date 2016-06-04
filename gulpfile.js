var gulp = module.exports = require('gulp');

var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var uglifyCss = require('gulp-uglifycss');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');

var stylus = require('gulp-stylus');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');

var exec = require('child_process').exec;

var apps = require('./package').apps;

// need to look into something for gulp and compass
// integration

var devMode = process.env.NODE_ENV !== 'production';

var dest = function (path, raw) {
    var dest = !!path ? __dirname + '/public/' + path : __dirname + '/public';
    return raw === true ? dest : gulp.dest(dest);
};

// compile bower libs
gulp.task('bower', function () {
    var compileJs = gulp.src(bowerFiles().filter(function (f) {
        return f.indexOf('.js') > -1;
    })).pipe(concat('vendor.js'));

    if (devMode) {
        compileJs.pipe(dest('js'));
    } else {
        compileJs.pipe(uglify()).pipe(dest('js'));
    }

    var compileCss = gulp.src(bowerFiles().filter(function (f) {
            return f.indexOf('.css') > -1;
        }))
        .pipe(concatCss('vendor.css'));

    if (devMode) {
        compileCss.pipe(dest('css'));
    } else {
        compileCss.pipe(uglifyCss()).pipe(dest('/css'));
    }

    gulp
        .src(bowerFiles().filter(function (f) {
            return ['.eot', '.woff', '.svg', '.ttf'].filter(function (ext) {
                return f.indexOf(ext) > -1;
            }).length > 0;
        }))
        .pipe(dest('fonts'));
});

gulp.task('sass', function () {
    var buildStyle = function (style) {
        //if (style == 'site') {
            exec('sass ' + __dirname + '/sass/' + style + '.scss ' + __dirname + '/public/css/' + style + '.css', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        //}
    };

    apps.forEach(function (app) {
        buildStyle(app);
    });
});

// watch sass
gulp.task('sass:watch', function () {
    gulp.watch(['./sass/**/*.*'], ['sass']);
});

// compile stylus
gulp.task('stylus', function () {
    var buildStyle = function (style) {
        console.log(style);
        var g = gulp.src(['stylus/' + style + '.styl'])
            .pipe(stylus())
            .pipe(prefixer({
                browser: ['last 2 versions'],
                cascade: false
            }));

        g.pipe(cssmin()).pipe(dest('css'));
    };

    apps.forEach(function (app) {
        buildStyle(app);
    });
});

// compile app
gulp.task('app', function () {
    var buildApp = function (app) {
        console.log(app);
        var g = gulp.src([
            'browser/' + app + '/vendor/**/*.js',
            'browser/' + app + '/app.js',
            'browser/' + app + '/utils/**/*.js',
            'browser/' + app + '/behaviors/**/*.js',
            'browser/' + app + '/components/**/*.js'
        ]);

        g.pipe(concat(app + '.js')).pipe(dest('js'));
    };

    apps.forEach(function (app) {
        buildApp(app);
    });
});

// compile assets
gulp.task('assets', function () {
    gulp.src(['assets/fonts/**/*.*']).pipe(dest('fonts'));
    gulp.src(['assets/img/**/*.*']).pipe(dest('img'));
    gulp.src(['assets/css/**/*.*']).pipe(dest('css'));
    gulp.src(['assets/font-awesome/css/**/*.*']).pipe(dest('css'));
    gulp.src(['assets/font-awesome/fonts/**/*.*']).pipe(dest('fonts'));
});

// clean build
gulp.task('clean', function () {
    del([dest('js/*', true), dest('!js/.gitignore', true)]);
    del([dest('css/*', true), dest('!css/.gitignore', true)]);
    del([dest('fonts/*', true), dest('!fonts/.gitignore', true)]);
    del([dest('img/*', true), dest('!img/.gitignore', true)]);
});

// compile everything
gulp.task('compile', ['sass', 'app'], function () {});

// watch and build during development
gulp.task('watch', ['app', 'sass'], function () {
    //gulp.watch(['./bower_components/**/*.*'], ['bower']);
    //gulp.watch(['./src/**/*.*'], ['app']);
    //gulp.watch(['./assets/**/*.*'], ['assets']);
    gulp.watch(['./sass/**/*.*'], ['sass']);
    gulp.watch(['./browser/**/*.*'], ['app']);
});
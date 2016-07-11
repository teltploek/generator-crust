/* jshint node:true */
'use strict';

var critical = require('critical').stream;
var gulp = require('gulp');
var glob = require('glob');
var merge = require('merge-stream');
var path = require('path');
var serverPort = 9000;
var $ = require('gulp-load-plugins')();
var crust = require('crust-io');
var _ = require('lodash');
var browserSync = require('browser-sync').create();

gulp.task('build', ['crust', 'html', 'fonts', 'copy', 'copy-source', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['build', 'connect', 'watch'], function () {});

gulp.task('connect', ['styles', 'crust'], function () {
  browserSync.init({
    server: {
      baseDir: ['./.tmp',  '/bower_components', './dist'],
      port: serverPort,
      index: 'index.html'
    }
  });
});

gulp.task('copy-source', ['graphics'], function () {
  return gulp.src([
    '.tmp/**'
    ], {
      base: '.tmp'
    }).pipe(gulp.dest('dist'));
});

gulp.task('copy', ['graphics'], function () {
  return gulp.src([
    'app/images/**/*',
    'app/graphics/**/*',
    'app/scripts/**/*',
    ], {
      base: 'app'
    }).pipe(gulp.dest('dist'));
});

gulp.task('critical', ['build'], function () {
  var streams = [];

  // we're doing inline critical css for a lot of html files, so to prevent a warning about memory leaks, we'll set max listeners a little higher than normal
  process.setMaxListeners(100);

  glob('dist/**/*.html', {}, function (er, files) {
    _.each(files, function(filepath) {
      var targetpath = path.dirname(filepath);

      streams.push(
        gulp.src(filepath)
        .pipe(critical({base: targetpath, inline: true, css: ['dist/styles/maincss-3.css'] }))
        .pipe(gulp.dest(targetpath))
        );

    });

    return merge.apply(this, streams);
  });
});

gulp.task('crust', function () {
  var dir = path.join(__dirname, 'app/source');

  return crust.compile(dir, {
    sourceFolder : 'app/source',
    templateFolder : path.join(__dirname, '/app/templates/pages/')
  });
});

gulp.task('default', ['clean'], function () {
  gulp.start('critical');
});

gulp.task('deploy', ['critical'], function () {
  var ghpages = require('gh-pages');
  var path = require('path');

  ghpages.publish(path.join(__dirname, 'dist'), function(err) {
    console.error(err);
  });
});

gulp.task('deploy-no-build', function () {
  var ghpages = require('gh-pages');
  var path = require('path');

  ghpages.publish(path.join(__dirname, 'dist'), function(err) {
    console.error(err);
  });
});

gulp.task('extras', function () {
  return gulp.src([
    '!app/*.html',
    'CNAME',
    '.htaccess',
    'app/source/index.html'
    ], {
      dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('graphics', function () {
  return gulp.src('app/{graphics,images}/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('html', ['styles', 'copy-source'], function () {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts');

  return gulp.src('.tmp/**/*.html')
    .pipe($.useref({
      searchPath: './.tmp'
    }))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*')
    .pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
  .pipe($.plumber())
  .pipe($.sass({
    style: 'expanded',
    precision: 10
  }))
  .pipe($.autoprefixer({ browsers: ['last 1 version'] }))
  .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('watch', ['graphics','scripts','connect'], function () {
  // watch for changes
  gulp.watch([
    '.tmp/**/*.html',
    '.tmp/**/*.js',
    '.tmp/**/*.css'
  ]).on('change', browserSync.reload);

  gulp.watch('app/{images,graphics}/**/*.*', ['graphics']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch(['app/templates/**/*.html', 'app/source/**/*.md', 'app/source/**/*.html', 'app/source/**/*.yaml'], ['crust']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
    .pipe(gulp.dest('app'));

  gulp.src('app/templates/**/*.html')
    .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
    .pipe(gulp.dest('app'));
});

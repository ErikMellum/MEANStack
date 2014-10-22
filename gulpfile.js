var gulp = require ('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-ruby-sass'),
    coffee = require('gulp-coffee'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    nodemon = require('gulp-nodemon');

var protractorSources = [
  'tests/e2e/*.js',
];

var bowerSources = [
  'bower_components/**/*.js'
];

var jsSources = [
  'components/scripts/*.js'
];

var appSources = [
  'components/scripts/app/controllers/*.js',
  'components/scripts/app/directives/*.js',
  'components/scripts/app/routing/*.js',
  'components/scripts/app/services/*.js'
];

var jslibSources = [
  'components/scripts/lib/*.js',
  'components/scripts/lib/**/*.js'
];

var csslibSources = [
  'components/css/lib/*.css'
];

var jsonSources = [
  'components/scripts/json/*.json'
];

var styleSources = [
  'components/sass/*.scss'
];

var cssSources = [
  'components/css/*.css'
];

var coffeeSources = [
  'components/coffee/*.coffee'
];

var viewSources = [ 
  'views/**/*.ejs'
];

gulp.task('lib', function(){
// Javascript libs livereload
  gulp.src(jslibSources)
  .pipe(gulp.dest('public/lib'))
  .pipe(livereload());
// CSS libs livereload
  gulp.src(csslibSources)
  .pipe(minifycss())
  .pipe(gulp.dest('public/lib'))
  .pipe(livereload());
});

gulp.task('protractor', function(){
  return gulp.src(protractorSources)
  .pipe(karma({
    configFile: 'tests/protractor-conf.js',
    action: 'run'
  }))
  .on('error', function(err) {
    // Make sure failed tests cause gulp to exit non-zero
    throw err;
  });
});

gulp.task('karma', function(done){
  karma.start({
    configFile: __dirname + '/tests/karma.conf.js'
  }, done);
});

gulp.task('json', function(){
// JSON livereload
  gulp.src(jsonSources)
  .pipe(gulp.dest('public/javascripts/json'))
  .pipe(livereload());
});

gulp.task('app', function(){
// App livereload
  gulp.src(appSources)
  .pipe(concat('app.js'))
  .pipe(gulp.dest('public/javascripts'))
  .pipe(livereload());
});

gulp.task('js', function() {
// Javascript hint, uglify, concat, and livereload
  gulp.src(jsSources)
  .pipe(jshint())
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('public/javascripts'))
  .pipe(livereload());
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
  .pipe(coffee({bare: true}))
    .on('error', gutil.log)
  .pipe(gulp.dest('components/scripts'));
});

gulp.task('css', function(){
  gulp.src(cssSources)
  .pipe(concat('main.css'))
  .pipe(gulp.dest('public/styles'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('public/styles'))
  .pipe(livereload());
});

gulp.task('styles', function(){
  // CSS autoprefixer, minify, and livereload
  gulp.src(styleSources)
  .pipe(sass({style: 'expanded', lineNumbers: true}))
    .on('error', gutil.log)
  .pipe(concat('sass.css'))
  .pipe(gulp.dest('public/styles'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('public/styles'))
  .pipe(livereload());
});

gulp.task('bower', function(){
  gulp.src(bowerSources)
  .pipe(gulp.dest('components/scripts/lib'));
});

gulp.task('launch', function () {
  nodemon({ script: './bin/www', ext: 'html js', ignore: ['components', 'public', 'design'] })
    .on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('views', function(){
 gulp.src(viewSources) 
 .pipe(livereload());
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(jsSources, ['js']);
  //gulp.watch(jsonSources, ['json']);
  gulp.watch(appSources, ['app']);
  //gulp.watch(coffeeSources, ['coffee']);
  //gulp.watch(styleSources, ['styles']);
  gulp.watch(cssSources, ['css']);
  gulp.watch(viewSources, ['views']);
});


gulp.task('default', ['styles', 'js', 'coffee', 'json', 'app', 'css', 'watch', 'karma', 'launch']);
gulp.task('lint', function () {
  gulp.src(jsSources)
    .pipe(jshint())
});



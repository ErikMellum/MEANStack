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
    autoprefixer = require('gulp-autoprefixer'),
    rimraf = require('gulp-rimraf'),
    nodemon = require('gulp-nodemon');

var protractorSources = [
  'app/tests/e2e/*.js',
];

var libraries = [
  'bower_components/**/*.*',
  'bower_components/bootstrap/dist/**/*.*',
  'bower_components/font-awesome/css/*.*',
  'bower_components/font-awesome/fonts/*.*',
  'bower_components/jquery/dist/*.*',
  'app/components/lib/**/*.*'
];

var appSources = [
  'app/components/scripts/app/**/*.js',
];

var jsSources = [
  'app/components/scripts/*.js'
];

var sassSources = [
  'app/components/sass/*.scss'
];

var cssSources = [
  'app/components/css/main.css',
  'app/components/css/sass.css',
  'app/components/css/style.css'

];

var coffeeSources = [
  'app/components/coffee/*.coffee'
];

var viewSources = [
  'app/views/**/*.ejs'
];

gulp.task('lib', function(){
// Javascript libs livereload
  gulp.src(libraries)
  .pipe(gulp.dest('app/public/lib'))
  .pipe(livereload());
});

gulp.task('protractor', function(){
  return gulp.src(protractorSources)
  .pipe(karma({
    configFile: 'app/tests/protractor-conf.js',
    action: 'run'
  }))
  .on('error', function(err) {
    // Make sure failed tests cause gulp to exit non-zero
    throw err;
  });
});

gulp.task('karma', function(done){
  karma.start({
    configFile: __dirname + 'app/tests/karma.conf.js'
  }, done);
});

gulp.task('app', function(){
// App livereload
  gulp.src(appSources)
  .pipe(concat('app.js'))
  .pipe(gulp.dest('app/public/javascripts'))
  .pipe(livereload());
});

gulp.task('js', function() {
// Javascript hint, uglify, concat, and livereload
  gulp.src(jsSources)
  .pipe(jshint())
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('app/public/javascripts'))
  .pipe(livereload());
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
  .pipe(coffee({bare: true}))
    .on('error', gutil.log)
  .pipe(gulp.dest('app/components/scripts'));
});

gulp.task('css', function(){
  gulp.src(cssSources)
  .pipe(concat('main.css'))
  .pipe(autoprefixer({browsers: ['last 2 versions', 'ie 10']}))
  .pipe(gulp.dest('app/public/styles'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('app/public/styles'))
  .pipe(livereload());
});

gulp.task('sass', function(){
  // CSS autoprefixer, minify, and livereload
  gulp.src(sassSources)
  .pipe(sass({style: 'expanded', lineNumbers: true}))
    .on('error', gutil.log)
  .pipe(concat('sass.css'))
  .pipe(gulp.dest('app/components/css'));
});

gulp.task('bower', function(){
  gulp.src(bowerSources)
  .pipe(gulp.dest('components/scripts/lib'));
});

gulp.task('launch', function () {
  nodemon({ script: './app/bin/www', ext: 'html js', ignore: ['components', 'public', 'design'] })
    .on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('clean', function(cb) {
  rimraf('./app/public', cb);
});

gulp.task('build', function(){
  gulp.src(libraries)
  .pipe(gulp.dest('app/public/lib'))

  gulp.src(appSources)
  .pipe(concat('app.js'))
  .pipe(gulp.dest('app/public/javascripts'))

  gulp.src(coffeeSources)
  .pipe(coffee({bare: true}))
    .on('error', gutil.log)
  .pipe(gulp.dest('app/components/scripts'));

  gulp.src(jsSources)
  .pipe(jshint())
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('app/public/javascripts'))

  gulp.src(sassSources)
  .pipe(sass({style: 'expanded', lineNumbers: true}))
    .on('error', gutil.log)
  .pipe(concat('sass.css'))
  .pipe(gulp.dest('app/components/css'));

  gulp.src(cssSources)
  .pipe(concat('main.css'))
  .pipe(gulp.dest('app/public/styles'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('app/public/styles'))
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
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(cssSources, ['css']);
  gulp.watch(viewSources, ['views']);
  gulp.watch(libraries, ['lib']);
});


gulp.task('default', ['clean', 'lib', 'sass', 'coffee', 'js', 'app', 'css', 'watch', 'launch']);
gulp.task('lint', function () {
  gulp.src(jsSources)
    .pipe(jshint())
});

var gulp = require('gulp'),
  less = require('gulp-less'),
  minify = require("gulp-mini-css"),
  autoprfixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  jsuglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  jade = require('gulp-jade'),
  imageop = require('gulp-image-optimization'),
  jsdoc = require("gulp-jsdoc"),
  exec = require('child_process').exec;

var paths = {
  js: "src/js/**/*js",
  less: "src/less/**/*.less",
  jade: "src/jade/**/*.jade",
  img: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.gif', 'src/img/**/*.jpeg']
};

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});


gulp.task("less", function() {
  return gulp.src(paths.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprfixer())
    .pipe(gulp.dest("build/css"))
    .pipe(minify({
      ext: '.min.css'
    }))
    .pipe(gulp.dest("build/css"))
    .pipe(connect.reload());

});

gulp.task("jade", function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest("build"))
    .pipe(connect.reload());
});

gulp.task("js", function() {
  return gulp.src(paths.js)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(rename({
      extname: ".js"
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(jsuglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(connect.reload());
});

gulp.task("image", function() {
  return gulp.src(paths.img)
    .pipe(plumber())
    .pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task("deploy",function(cb) {
  exec("inliner build/index.html >> output.html", function(err, stdout, stderr) {
    if (err) return cb(err); // return error
    console.log(stdout);
    console.log(stderr);
    cb(); // finished task
  });
});

gulp.task("watch", function() {
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.jade, ['jade']);
});

gulp.task('default', ["connect", "less", "jade", "js", "image", "watch"]);

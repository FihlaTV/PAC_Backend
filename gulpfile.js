var browserify = require('browserify'),
    watchify = require('watchify'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    hbsfy = require("hbsfy"),
    apidoc = require('gulp-apidoc'),
    destCSS = 'public/css/',
    mocha = require('gulp-mocha'),
    fs = require('fs-extra'),
    exit = require('gulp-exit'),
    jsdoc = require("gulp-jsdoc3");

var props = {
    entries: sourceFile,
    debug: true,
    cache: {},
    packageCache: {},
};

var sourceFile = './src/client/js/main.js',
    destFolder = './public/js/',
    destFile = 'bundle.js',
    sourceCSS = 'src/client/css/';
    
// build for dist
gulp.task('browserify-build', function() {

    var bundler = browserify({
        // Required watchify args
        cache: {}, 
        packageCache: {}, 
        fullPaths: true,
        // Browserify Options
        entries: sourceFile,
        debug: true
    });

    hbsfy.configure({
        extensions: ['hbs']
    });
    
    var bundle = function() {
        return bundler
        .transform(hbsfy)
        .bundle()
        .on('error', function(err){
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source(destFile))
        .pipe(gulp.dest(destFolder));
    };

    return bundle();
  
});

gulp.task('copy', function() {

    gulp.src('node_modules/bootstrap-sass/assets/fonts/**/*').pipe( gulp.dest('public/fonts') );
    gulp.src('node_modules/font-awesome/fonts/**/*').pipe( gulp.dest('public/fonts') );
    gulp.src('src/client/index.html').pipe( gulp.dest('public') );
    gulp.src('src/client/images/**/*').pipe( gulp.dest('public/images') );
    gulp.src('src/client/sounds/**/*').pipe( gulp.dest('public/sounds') );
    gulp.src('src/server/assets/**/*').pipe( gulp.dest('public/assets') );
	gulp.src('node_modules/jquery-colorbox/example1/images/*').pipe( gulp.dest('public/css/images') );

});

gulp.task('build-css', function() {

  return gulp.src(sourceCSS + '*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(destCSS));
});

gulp.task('build-apidoc', function(done){
    
    apidoc.exec({
        src: "src/",
        dest: "public/doc/API",
        debug: false
    },done);

});

gulp.task('build-jsdoc', function(done){

    var config = {
    "opts": {
        "encoding": "utf8",
        "destination": "./public/doc/JS",
        "recurse": true,
        }
    }
    
    gulp.src(['./src/**/*.js'], {read: false})
        .pipe(jsdoc(config));

});

gulp.task('build-dist',['build-apidoc','copy','browserify-build','build-css','spika'],function(){
    
    
});


// tests
gulp.task('spika-test', function (done) {
    return gulp.src('modules_customised/spika/src/server/test/**/*.js', { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(exit());
});


gulp.task('messenger-test', function (done) {
    return gulp.src('src/server/test/**/*.js', { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(exit());
});

gulp.task('server-test',['spika-test'], function (done) {
    return gulp.src('src/server/test/**/*.js', { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(exit());
});

gulp.task('spika',function(){
    
    var spikaDir = "./modules_customised/spika/";
    
    fs.mkdirsSync(spikaDir + 'public/uploads')
    gulp.src(spikaDir + 'src/client/js/adapter.js').pipe( gulp.dest(spikaDir + 'public/js') );
    gulp.src(spikaDir + 'src/client/*.html').pipe( gulp.dest(spikaDir + 'public') );
    gulp.src(spikaDir + 'src/client/img/**/*').pipe( gulp.dest(spikaDir + 'public/img') );
    gulp.src(spikaDir + 'node_modules/bootstrap-sass/assets/fonts/**/*').pipe( gulp.dest(spikaDir + 'public/fonts') );
    gulp.src(spikaDir + 'src/client/css/backgroundsize.min.htc').pipe( gulp.dest(spikaDir + 'public') );
    gulp.src(spikaDir + 'node_modules/jquery-colorbox/example1/images/*').pipe( gulp.dest(spikaDir + 'public/css/images') );
    
    gulp.src(spikaDir + 'src/client/css/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(spikaDir + 'public/css/'));
    
    var bundler = browserify({
        // Required watchify args
        cache: {}, 
        packageCache: {}, 
        fullPaths: true,
        // Browserify Options
        entries: spikaDir + 'src/client/js/main.js',
        debug: true
    });
    
    hbsfy.configure({
        extensions: ['hbs']
    });
    
    var bundle = function() {
        return bundler
        .transform(hbsfy)
        .bundle()
        .on('error', function(err){
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(spikaDir + 'public/js/'));
    };
    

    return bundle();

});

gulp.task('default',['build-dist'],function(){
    
    gulp.watch('src/client/**/*',['build-dist']);
    
});

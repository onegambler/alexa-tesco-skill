'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const zip = require('gulp-zip');
const del = require('del');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const awsLambda = require('node-aws-lambda');
const shell = require('gulp-shell');
const config = require('./config/lambda-config');


const filePaths = {
    lintFiles: ['index.js', 'gulpfile.js', './lib/**/*.js', './config/**/*.js', './test/**/*.js'],
    unitTestFiles: ['test/**/*.js']
};

gulp.task('clean', () => del(['./dist', './dist.zip']));

gulp.task('lint', () => gulp.src(filePaths.lintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', shell.task('mocha -c --recursive'));

gulp.task('build', callback => runSequence(
    'clean',
    'lint',
    'test',
    ['js', 'assets', 'config', 'node-mods'],
    'zip',
    callback)
);

gulp.task('upload', callback => awsLambda.deploy('./dist.zip', config, callback));

gulp.task('js', () => {
    gulp.src('index.js').pipe(gulp.dest('dist/'));
    return gulp.src('lib/**').pipe(gulp.dest('dist/lib'));
});

// TODO: Make this env production/develop/test config files
gulp.task('config', () => gulp.src('config/*').pipe(gulp.dest('dist/config')));


gulp.task('assets', () => {
    gulp.src('assets/*').pipe(gulp.dest('dist/assets'));
    return gulp.src('images/*').pipe(gulp.dest('dist/images'));
});

gulp.task('node-mods', () => gulp.src('./package.json')
    .pipe(gulp.dest('./dist/'))
    .pipe(install({ production: true }))
);

gulp.task('zip', () => gulp.src(['dist/**/*', '!package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
);

gulp.task('upload', function(callback) {
    awsLambda.deploy('./dist.zip', require("./lambda-config.js"), callback);
});

gulp.task('deploy', callback => runSequence(
    ['build'],
    ['upload'],
    callback
));

gulp.task('watch-test', () => gulp.watch(filePaths.unitTestFiles, ['test']));

gulp.task('watch-lint', () => {
    gulp.watch(filePaths.lintFiles).on('change', (file) => {
        gulp.src(file.path)
            .pipe(eslint())
            .on('error', (err) => {
                console.log(err);
            });   // jslint spits out errors
    });
});

gulp.task('watch', ['watch-lint', 'watch-test']);

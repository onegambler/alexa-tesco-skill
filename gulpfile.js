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
const map = require('map-stream');
const yaml = require('js-yaml');
const rename = require('gulp-rename');

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
    ['js', 'assets', 'config', 'node-mods', 'build-assets'],
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

gulp.task('zip', () => gulp.src(['dist/**', '!package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
);

gulp.task('upload', (callback) => {
    awsLambda.deploy('./dist.zip', config, callback);
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

function parseProductsFile(file, contentExtractor, callback) {
    if (file.isNull()) return callback(null, file);
    if (file.isStream()) return callback(new Error('Streaming not supported'));
    const json = yaml.load(String(file.contents.toString('utf8')));
    const dest = {};
    for (let i = 0; i < json.products.length; i++) {
        const product = json.products[i];
        Object.keys(product).forEach((key) => {
            dest[key] = product[key].id;
            if (Array.isArray(product[key].aliases)) {
                product[key].aliases.forEach((alias) => {
                    dest[alias] = product[key].id;
                });
            }
        });
    }
    file.contents = new Buffer(contentExtractor(dest));
    return callback(null, file);
}

gulp.task('build-assets', () => {
    gulp.src('speechAssets/*').pipe(gulp.dest('dist/speechAssets'));
    gulp.src('products.yml')
        .pipe(map((file, cb) => {
            const contentExtractor = content => JSON.stringify(content, null, 4);
            parseProductsFile(file, contentExtractor, cb);
        }))
        .pipe(rename('products.json'))
        .pipe(gulp.dest('dist/data'));

    gulp.src('products.yml')
        .pipe(map((file, cb) => {
            const contentExtractor = content => Object.keys(content).join('\n');
            parseProductsFile(file, contentExtractor, cb);
        }))
        .pipe(rename('GROCERIES'))
        .pipe(gulp.dest('dist/speechAssets/slot-types'));
});

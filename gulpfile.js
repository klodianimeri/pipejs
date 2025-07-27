import {
    series,
    src,
    dest,
} from 'gulp';

const JS_FILES = [
    './dist/*.js', './dist/**/*.js',
    '!./src/*.min.js', '!./src/**/*.min.js',
]

function minify(cb) {
    src(JS_FILES)
        .pipe(terser({
            compress: {
                // module: true,
                keep_infinity: true,
                pure_getters: true,
                passes: 100
            },
            format: {
                // By default, Terser wraps function arguments in extra parens to trigger eager parsing.
                // Whether this is a good idea is way too specific to guess, so we optimize for size by default:
                wrap_func_args: false,
                comments: /^\s*([@#]__[A-Z]+__\s*$|@cc_on)/,
                preserve_annotations: true,
            },
            module: true,
            ecma: 'es6',
            toplevel: true
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./dist/'))
}
import gulp from "gulp";

import concat from "gulp-concat";
import minify  from "gulp-minify";
import cleanCSS  from "gulp-clean-css";
import clean  from "gulp-clean";
import browserSync  from "browser-sync";
import imagemin from "gulp-imagemin";

import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

const html =() => {
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist"));
}
const js = () => {
    return gulp.src("./src/scripts/**/*.js")
        .pipe(concat('script.js'))
        .pipe(minify( {
            ext:{
                src:'.js',
                min:'.min.js'
            },
        }))
        .pipe(gulp.dest("./dist/scripts"));
}

const css = () => {
    return gulp.src("./src/styles/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        // .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("./dist/styles"));
}

const image = () => {
    return gulp.src("./src/images/**/*.*")
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/images"));
}

const cleanDist = () => {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
}

const watcher = () => {
    gulp.watch("./src/*.html", html).on('all', browserSync.reload);
    gulp.watch("./src/styles/**/*.{scss,sass,css}", css).on('all', browserSync.reload);
    gulp.watch("./src/scripts/**/*.js", js).on('all', browserSync.reload);
    gulp.watch("./src/images/**/*.*", image).on('all', browserSync.reload);
}

gulp.task("html", html);
gulp.task("script", js);
gulp.task("styles", css);
gulp.task("cleanDist", cleanDist);
gulp.task("server", server);
gulp.task("image", image);


// задача викл коли ще розробл проект:
gulp.task("dev", gulp.series(
    gulp.parallel(html, css, js, image),
gulp.parallel(server, watcher)
))


//викликається задача коли прект вже потрібно здати:
gulp.task("build", gulp.series(
    cleanDist,
    gulp.parallel(html, css, js, image)
));
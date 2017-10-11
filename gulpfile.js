var gulp=require("gulp");
var cssmin = require('gulp-minify-css'); //css压缩
var uglify = require('gulp-uglify');  //js 压缩
//var imagemin = require('gulp-imagemin'); //图片压缩
//var sass = require('gulp-sass');     //sass编译

gulp.task("cssMin",function(){              //css压缩
     gulp.src("public/css/*.css")
         .pipe(cssmin())
         .pipe(gulp.dest("public/min/css"));
});


gulp.task('jsMin', function () {
    gulp.src('public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/min/js'));
});


// gulp.task('imageMin', function () {      //图片压缩
//     gulp.src('public/images/*.{png,jpg,gif,ico}')
//         .pipe(imagemin({
//             optimizationLevel: 5 //类型：Number  默认：3  取值范围：0-7（优化等级）
//         }))
//         .pipe(gulp.dest('public/min/images'));
// });

gulp.task("watch",function(){
    gulp.watch("public/css/*.css",['cssMin']);
    gulp.watch("public/js/*.js",['jsMin']);
    //gulp.watch("public/images/*",['imageMin']);
    
});

gulp.task('default', ['cssMin','jsMin','watch']);

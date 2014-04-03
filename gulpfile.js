var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

//gulp.task('watch', function() {
//    var server = livereload();
//    gulp.watch('server.js').on('change', function(file) {
//        server.changed(file.path);
//    });
//});

gulp.task('default', function () {
    nodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
        .on('restart', function () {
            console.log('restarted!')
        })
})
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
/*******
 * Start server and listen for changes to server.js
 *******/
gulp.task('default', function () {
    nodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
        .on('restart', function () {
            console.log('restarted!')
        })
})
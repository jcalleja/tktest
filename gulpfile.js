var gulp = require('gulp');

var Server = require('karma').Server;
/**
* Test task, run test once and exit
*/
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/tests/my.conf.js',
    singleRun: true,
    autoWatch: false
  }, done).start();
});
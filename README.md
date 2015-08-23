# gulp-process

[Gulp](http://gulpjs.com) plugin for running and automatically
restarting processes.

## Install

```sh
$ npm install --save-dev gulp-process
```

## Usage

```js
var gulp = require('gulp');
var gulpProcess = require('gulp-process');

gulp.task('tpl', function() {
	return gulp.src('tpl/*.tpl')
		.pipe(gulp.dest('build'))
        .pipe(gulpProcess.restartStream('goserver'));
});

gulp.task('serve', function() {
  gulpProcess.start('goserver', './build/goserver');

  gulp.watch('tpl/*.tpl', ['tpl']);
});
```

## API

### start(name, command, args, opts)
### restart(name)
### restartStream(name)

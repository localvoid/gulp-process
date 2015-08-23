'use strict';

var child = require('child_process');
var through = require('through2');
var gutil = require('gulp-util');

var processes = {};

function GulpProcess(command, args, opts) {
  if (Array.isArray(args)) {
    this.args = args;
  } else {
    this.args = [];
    opts = args;
  }
  opts = opts || {};

  this.command = command;
  this.args = args;
  this.opts = opts;

  this.restartDelay = opts.restartDelay || 1000;
  this.killSignal = opts.killSignal || 'SIGKILL';

  this.process = null;
  this._restartTimer = null;
}

GulpProcess.prototype.start = function() {
  this._restartTimer = null;

  var p = this.process = child.spawn(this.command, this.args, this.opts,
      function(err) {
        if (err) {
          gutil.log(err);
        }
      });

  p.stdout.on('data', function(b) { gutil.log(b.toString()); });
  p.stderr.on('data', function(b) { gutil.log(b.toString()); });
};

GulpProcess.prototype.stop = function() {
  if (this.process) {
    this.process.kill(this.killSignal);
    this.process = null;
  }
};

GulpProcess.prototype.restart = function() {
  this.stop();
  if (this._restartTimer) {
    clearTimeout(this._restartTimer);
  }
  this._restartTimer = setTimeout(this.start.bind(this), this.restartDelay);
};


function start(name, command, args, opts) {
  var p = processes[name];
  if (!p) {
    p = processes[name] = new GulpProcess(command, args, opts);
  }
  p.start();
}

function restart(name) {
  var p = processes[name];
  if (p) {
    p.restart();
  }
}

function restartStream(name) {
  return through.obj(function(file, enc, cb) {
    this.push(file);
    restart(name);
    cb();
  });
}

module.exports = {
  start: start,
  restart: restart,
  restartStream: restartStream
};

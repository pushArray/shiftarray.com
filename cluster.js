require('colors');
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  var cpuCount = os.cpus().length;
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    var time = new Date().toString();
    var msg =  '%s: Worker %d exited (%s). Restarting...';
    console.log(msg.red, time, worker.process.pid, signal || code);
    cluster.fork();
  });
  cluster.on('online', function(worker) {
    var time = new Date().toString();
    var msg = '%s: Worker %d is online.';
    console.log(msg.green, time, worker.process.pid);
  });
} else {
  require('./server');
}

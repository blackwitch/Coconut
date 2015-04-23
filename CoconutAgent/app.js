var http = require('http');

var express = require('express');
var bodyParser = require('body-parser');
var scheduler = require('node-schedule');
var rpc = require('json-rpc2');
var md5 = require('MD5');

var cfg = require('./config');

var util = require('./lib/util');
var proc = require('./lib/mon_proc');
var procUpdate = require('./lib/update_proc');
var cmd = require('./lib/commands');

//	for request of Centre Manager
var app = express();

proc.handshake();


//	schedules
var tsRule0 = new scheduler.RecurrenceRule();
tsRule0.second = 0;	//	send system info per 1min
scheduler.scheduleJob(tsRule0, function(){
	proc.updateSystemInfo();
});

var tsRule10 = new scheduler.RecurrenceRule();
tsRule10.second = 10;	//	send system info per 1min
scheduler.scheduleJob(tsRule10, function(){
	proc.updateSystemInfo();
});

var tsRule20 = new scheduler.RecurrenceRule();
tsRule20.second = 20;	//	send system info per 1min
scheduler.scheduleJob(tsRule20, function(){
	proc.updateSystemInfo();
});

var tsRule30 = new scheduler.RecurrenceRule();
tsRule30.second = 30;	//	send system info per 1min
scheduler.scheduleJob(tsRule30, function(){
	proc.updateSystemInfo();
});

var tsRule40 = new scheduler.RecurrenceRule();
tsRule40.second = 40;	//	send system info per 1min
scheduler.scheduleJob(tsRule40, function(){
	proc.updateSystemInfo();
});

var tsRule50 = new scheduler.RecurrenceRule();
tsRule50.second = 50;	//	send system info per 1min
scheduler.scheduleJob(tsRule50, function(){
	proc.updateSystemInfo();
});


/////////////////////////////////////////////////////
// Create a server object with options 
var ips = util.getIPs();
console.log('IPs >>' + ips);

var serv = rpc.Server.$create({
	'headers' : {
		'Access-Control-Allow-Origin' : '*'
	}
});

// Add your methods 
function download(args, opt, callback){
	console.log('start download ... ');
	procUpdate.download(args, ips[ips.length-1], callback);
}

serv.expose('ps', cmd.ps);
serv.expose('pwd', cmd.pwd);
serv.expose('bash', cmd.bash);
serv.expose('ls', cmd.ls);
serv.expose('cd', cmd.cd);
serv.expose('curl', cmd.curl);
serv.expose('mkdir', cmd.mkdir);
serv.expose('rmdir', cmd.rmdir);
serv.expose('rm', cmd.rm);
serv.expose('tail', cmd.tail);
serv.expose('find', cmd.find);
serv.expose('svn', cmd.svn);
serv.expose('procCtrl', cmd.procCtrl);	// process control. start, stop, restart
serv.expose('download', download);
serv.expose('update_apps',proc.update_apps);

// Start the server 
serv.listen(cfg.getPortAgentRpc(),ips[ips.length-1]);

console.log( "Start Coconut Agent... !!");


/////////////////////////////////////////////////
//	for File Transfer SERVER
/////////////////////////////////////////////////
//	for File Transfer SERVER
var io = require('socket.io').listen(cfg.getPortAgentFileTransfer());
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');

io.sockets.on('connection', function(socket){
	ss(socket).on('file', function(stream,data){
		fs.mkdir(data.path,function(err){
			if(err)
			{
				console.log( 'error >> ' + err);
			}
			var fn = data.path + '/' + data.name;
			fn = fn.replace('//','/');
			console.log( fn );
			stream.pipe(fs.createWriteStream(fn));
		});
	});
});

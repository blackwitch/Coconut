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
var fs  = require('fs');

//////////////////////////////////
//	Coconut Agent plugin 
var path = require('path');
var architect = require("architect");
var plugin_configPath = path.join(__dirname, "./plugins.js");
if(fs.existsSync( plugin_configPath))
{
	var plugin_config = architect.loadConfig(plugin_configPath);

	architect.createApp(plugin_config, function (err, app) {
	  if (err){
	  	console.log("plugin Error >>" + err);	
	  }else{
	  	console.log("Loading complete plugins !");	
	  }
	  
	});
}else{
	console.log("Failed to load plugins. Check the file 'plugins.js' !");	
}
//	Coconut Agent plugin 
//////////////////////////////////

//	for request of Centre Manager
var app = express();

proc.handshake();


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
	procUpdate.download(args, callback);
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

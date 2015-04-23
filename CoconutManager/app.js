var cfg = require('./config');
var fs  = require('fs');
var http  = require('http');
var https = require('https');
var os = require('os');
var fs = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
var scheduler = require('node-schedule');
var redis = require('redis');
var rpc = require('json-rpc2');
var url = require('url');

var agentRecv = require('./routes/agent_receive');
var viewer = require('./routes/viewer_request');
var apps = require('./routes/viewer_cmd4apps');

var app = express();
var appSrv = express();

//	for RPC SERVER
var upload_server_list = '';
var upload_target_path = '';

/////////////////////////////////////////////////
//	WAS for Monitor
appSrv.use(bodyParser.json());
appSrv.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

appSrv.post('/agent_updateinfo', agentRecv.agtRecv_UpdateInfo);
appSrv.post('/agent_handshake', agentRecv.agtRecv_HandShake);

app.post('/srv_list', viewer.srv_list);
app.post('/srv_info', viewer.srv_info);
app.post('/srv_ps_list', viewer.srv_ps_list);
app.post('/srv_regist_app_update', viewer.srv_regist_app_update);
app.post('/srv_registed_app_list', viewer.srv_registed_app_list);
app.post('/srv_remove', viewer.srv_remove);
app.post('/srv_getrtinfo', viewer.srv_getrtinfo);
app.post('/dist_repo_update', viewer.dist_repo_update);
app.post('/file_upload', function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	if(req.body.servers === undefined || req.body.servers.length == 0){
		res.send( {'error':'-1', 'message':'no server'});
		return;
	}
	upload_server_list = req.body.servers;
	upload_target_path = req.body.target_path;

	console.log(" server list : " + upload_server_list[0]);
	//	임시로 서버 리스트를 이곳에 저장하자.
	res.send( {'error':'0', 'message':'Set the server list.'});
});

app.post('/front_modify_nick', viewer.modify_nick);
app.post('/front_modify_group', viewer.modify_group);

app.post('/app_start', apps.cmd_start);
app.post('/app_stop', apps.cmd_stop);
app.post('/app_restart', apps.cmd_restart);

appSrv.use(function(req, res, next){
	res.send( 'Not Found !' );
});

app.use(function(req, res, next){ 
	res.send( 'Not Found !' );
});

//	internal open port >> agent to mng 
var httpServer = http.createServer(appSrv);
httpServer.listen(cfg.getPortMngInternalHttp());

//	external open port >> client to front
var httpsServer = http.createServer(app);
httpsServer.listen(cfg.getPortMngExternalHttp());

module.exports = app;

console.log( "Start Coconut Manager... !!");


/////////////////////////////////////////////////
//	for RPC SERVER
// Create a server object with options 
var rpc_session  = require('./routes/rpc_session');
var rpc_cmd = require('./routes/rpc_command');

var serv = rpc.Server.$create({
	'websocket': true,
	'headers' : {
		'Access-Control-Allow-Origin':'*'
	}
});

serv.expose('system.describe', rpc_session.system_describe);
serv.expose('login', rpc_session.login);
serv.expose('connect', rpc_session.connect);
serv.expose('whoru', rpc_cmd.whoru);
serv.expose('pwd', rpc_cmd.pwd);
serv.expose('ls', rpc_cmd.ls);
serv.expose('dir', rpc_cmd.ls);
serv.expose('cd', rpc_cmd.cd);
serv.expose('curl', rpc_cmd.curl);
serv.expose('mkdir', rpc_cmd.mkdir);
serv.expose('rmdir', rpc_cmd.rmdir);
serv.expose('del', rpc_cmd.rm);
serv.expose('rm', rpc_cmd.rm);

serv.expose('tail', rpc_cmd.tail);
serv.expose('find', rpc_cmd.find);
serv.expose('svn', rpc_cmd.svn);

//serv.expose('bash', rpc_cmd.bash);

// Start the server 
serv.listen(cfg.getPortMngApi(), cfg.getIpMng());

/////////////////////////////////////////////////
//	for File Transfer SERVER
var io = require('socket.io').listen(cfg.getPortMngFileTransfer());
var cli_io = require('socket.io-client');
var ss = require('socket.io-stream');
var path = require('path');

io.sockets.on('connection', function(socket){
	ss(socket).on('file', function(stream,data){
		var fn = './files/' + path.basename(data.name);
		console.log("save file on " + fn);
		stream.pipe(fs.createWriteStream(fn));
	});

	socket.on('done', function(data){
		if(upload_server_list != 'undefined' && upload_server_list.length >0){
			for(var i=0;i<upload_server_list.length;i++){
				var addr = 'http://' + upload_server_list[i].replace('IP_','') + ':' + cfg.getPortAgentFileTransfer();
				console.log('send ' + data.name + ' to ' + addr );
				console.log('get file >> ' + data.path  +  data.name);

				var AllSize = data.size;
				var UploadedSize = 0;
				var cli_sock = cli_io.connect(addr);
				var stream = ss.createStream();
				ss(cli_sock).emit('file', stream, {path: data.path, name: data.name, size: data.size});
				var fn = './files/' + path.basename(data.name);
				var blobstream = fs.createReadStream( fn);
				blobstream.on('data',function(chunk){
					UploadedSize += chunk.length;
					console.log( 'send file ' + data.name + 'size (' + UploadedSize + '/' + AllSize + ') >> ' + addr);
				});
				blobstream.pipe( stream );
			}
		}
	});
});

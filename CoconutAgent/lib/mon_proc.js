var os 	= require('os');
var fs  = require('fs');
var https = require('https');

var wcpu= require('windows-cpu');
var request = require('request');
var ps 	= require('ps-node');
var spawn= require('child_process').spawn;

var cfg = require('../config');
var util= require('./util');
var IS_WIN = process.platform === 'win32';


var uuid= '';
var mngAppsList = [];
var winLastRecv = 0, winLastSend = 0;

function doHandShaking(){
	console.log('uuid = ' + uuid);
	var post_data = {
		'uid': uuid, 
		'hostname' : os.hostname(),
		'platform' : os.type() + "/" + os.arch(),
		'totalmem' : os.totalmem(),
		'cpucount' : os.cpus().length
	};
/*	
	var opt = {
		host: '172.31.5.12',
		port: 8443,
		path: '/agent_handshake',
		method: 'POST',
		json: true,   // <--Very important!!!
		body: post_data
	};
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	opt.agent = new https.Agent(opt);
	https.request(opt, function (err, res){
		console.log("handshake success!!" + err);
		console.log("handshake success!!" + res);
	}).end();
*/
	request({
		url: "http://" + cfg.getIpMng() + ":" + cfg.getPortMngInternalHttp()+ "/agent_handshake",
		method: "POST",
		json: true,   // <--Very important!!!
		body: post_data
	}, function (error, response, body){
		if(error){
			console.log("updateSystemInfo error!! >>" + error);
		}else{
			mngAppsList = [];
			if(body.apps != undefined){
				for(var i=0;i<body.apps.length;i++){
					mngAppsList.push( body.apps[i] );
				}
			}
		}
	});	
};

exports.update_apps = function (args, opt, callback){
	mngAppsList = [];
	for(var i=0;i<args.length;i++)
		mngAppsList.push( args[i] );

	callback({'res':'OK!!'});
};

exports.handshake = function(){
	uuid = util.generateUUID();
	doHandShaking();
};



function sendSystemInfo_cpu(cpus, maxCpuLoad, net_recv, net_send){
	if( mngAppsList.length > 0)
	{
		ps.lookup({
			command:'',	//	없으면 모든 process를 볼 수 있다.
			psargs:'ux'
		}, function(err,psList){
			if(err)
			{
				sendSystemInfo(cpus, maxCpuLoad, net_recv, net_send);
			}else{
				var arrayApps = mngAppsList.slice();
				for(var i=0;i<psList.length;i++){
					if(psList[i].command == '')
						continue;
					psList[i].command = psList[i].command.replace(/"/gi,'');
					var data = psList[i].command + '|';
					for(var a=0;a<psList[i].arguments.length-1;a++){
						if(a != 0)
							data += ' ';
						data += psList[i].arguments[a];
					}
					var existedFlag = arrayApps.indexOf( data );
					if(existedFlag >= 0)
					{
						arrayApps[existedFlag] = data+'|1' ;
					}
				}

				for(var j=0;j<arrayApps.length;j++){
					if(arrayApps[j].split('|').length <=2){
						arrayApps[j] += '|0' ;	
					}
				}
				sendSystemInfo(cpus, maxCpuLoad, net_recv, net_send, arrayApps);
			}
		});
	}else
	{
		sendSystemInfo(cpus, maxCpuLoad,net_recv, net_send);
	}
}

function sendSystemInfo(cpus, maxCpuLoad, net_recv, net_send, registed_apps){
	var post_data = {
		'uid': uuid, 
		'uptime':  os.uptime(),
		'cpuload':  maxCpuLoad,
		'apps' : registed_apps,
		'freemem' : os.freemem(),
		'net_recv' : net_recv,
		'net_send' : net_send
	};
	
	request({
		url: "http://" + cfg.getIpMng() + ":" + cfg.getPortMngInternalHttp()+ "/agent_updateinfo",
		method: "POST",
		json: true,   // <--Very important!!!
		body: post_data
	}, function (error, response, body){
		if(error)
		{
			console.log("updateSystemInfo error!! >>" + error);
		}else{
			if(body.error != '0')
				doHandShaking();
		}
	});
}

exports.updateSystemInfo = function(){
	var cpus = os.cpus();
	var maxCpuLoad = 0;

	if( IS_WIN )
	{
		var cmd = spawn('netstat', ['-e']);
		cmd.stdout.setEncoding('utf8');
		var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.

		cmd.stdout.on('data', function(data){
			result += data;
		});
		cmd.stdout.on('end', function(data){
			var allData = result.split(/[ \r\n]+/);
			var recvTotal = (parseInt(allData[5]) - winLastRecv)/10;	//	per sec
			var sendTotal = (parseInt(allData[6]) - winLastSend)/10;	//	per sec
			winLastRecv = parseInt(allData[5]);
			winLastSend = parseInt(allData[6]);

			maxCpuLoad = os.loadavg()[0];
			wcpu.totalLoad(function(err, results){
				if(err){
					console.log(err);
				}else{
					if(results === undefined)
						return;
					maxCpuLoad = results[0];
					sendSystemInfo_cpu(cpus, maxCpuLoad, recvTotal, sendTotal);
				}
			});
		});		
		cmd.stderr.on('data', function(data){
			result += data;
		});
		cmd.on('exit', function(data){
			result += data;
		});
	}else{
		var cmd = spawn('ss');
		cmd.stdout.setEncoding('utf8');
		var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.
		
		cmd.stdout.on('data', function(data){
			result += data;
		});
		cmd.stdout.on('end', function(data){
			var allData = result.split(/[ ]+/);
			var lineCount = 8;
			var allLineCount = allData.length / lineCount;
			var recvTotal = 0, sendTotal = 0;
			for(var i=1;i<allLineCount;i++){
				recvTotal += parseInt(allData[(i*lineCount) + 2]);
				sendTotal += parseInt(allData[(i*lineCount) + 3]);
			}
			maxCpuLoad = os.loadavg()[0];
			sendSystemInfo_cpu(cpus, maxCpuLoad,recvTotal, sendTotal);
		});		
		cmd.stderr.on('data', function(data){
			result += data;
		});
		cmd.on('exit', function(data){
			result += data;
		});

	}
}

var os 	= require('os');
var fs  = require('fs');
var https = require('https');

var wcpu= require('windows-cpu');
var request = require('request');
var ps 	= require('ps-node');

var cfg = require('../config');
var util= require('./util');
var IS_WIN = process.platform === 'win32';

var uuid= '';
var mngAppsList = [];

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
					console.log( ' >> ' + body.apps[i]);
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

function sendSystemInfo_cpu(cpus, maxCpuLoad){
	if( mngAppsList.length > 0)
	{
		ps.lookup({
			command:'',	//	없으면 모든 process를 볼 수 있다.
			psargs:'ux'
		}, function(err,psList){
			if(err)
			{
				sendSystemInfo(cpus, maxCpuLoad);
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
				sendSystemInfo(cpus, maxCpuLoad, arrayApps);
			}
		});
	}else
	{
		sendSystemInfo(cpus, maxCpuLoad);
	}
}

function sendSystemInfo(cpus, maxCpuLoad, registed_apps){
	var post_data = {
		'uid': uuid, 
		'uptime':  os.uptime(),
		'cpuload':  maxCpuLoad,
		'apps' : registed_apps,
		'freemem' : os.freemem()
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
		wcpu.totalLoad(function(err, results){
			if(err){
				console.log(err);
			}else{
				if(results === undefined)
					return;
				maxCpuLoad = results[0];
				sendSystemInfo_cpu(cpus, maxCpuLoad);
			}
		});
	}else{
		maxCpuLoad = os.loadavg()[0];
		sendSystemInfo_cpu(cpus, maxCpuLoad);
	}
}

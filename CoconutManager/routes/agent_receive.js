var redis = require('redis');
var cfg = require('../config');

exports.agtRecv_HandShake = function(req,res){
	
	if(	req.body.uid == undefined || 
		req.body.hostname == undefined || 
		req.body.platform == undefined || 
		req.body.totalmem == undefined || 
		req.body.cpucount == undefined
	){
		console.log(req.body);
		console.log("params are undefined");
		res.send( {'error':'application error -1024'});
		return;
	}
	var uid = req.body.uid;
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	redis_cli.lrange(uid,0,-1,function(err,reply){
		if(err){
			console.log(err);
			res.send( {'error':'application error -1025'});
			redis_cli.quit(function(err,res){});
			return;
		}
		if(reply.length == 0){	//	regist this server
			redis_cli.sadd('servers',uid, function(err, reply){
				if(err){
					console.log(err);
					res.send( {'error':'application error -1026'});
					redis_cli.quit(function(err,resp){});
					return;
				}else{
					//	save info
					{	//	delete old data
						var appKey = uid + '_APPS';
						redis_cli.del(appKey);
					}
					
					redis_cli.rpush(uid, req.body.hostname);
					redis_cli.rpush(uid, req.body.platform);
					redis_cli.rpush(uid, req.body.totalmem);
					redis_cli.rpush(uid, req.body.cpucount);
					redis_cli.rpush(uid, 'nick');

					redis_cli.rpush(uid, 'group');
					redis_cli.rpush(uid, 'uptime');
					redis_cli.rpush(uid, 'freemem');
					redis_cli.rpush(uid, 'freedisk');
					redis_cli.rpush(uid, 'maxcpuusage');

					redis_cli.rpush(uid, 'apps');
					redis_cli.rpush(uid, 'net_recv');
					redis_cli.rpush(uid, 'net_send');
					
					res.send( {'error':'0'});
					redis_cli.quit(function(err,resp){});
				}
			});
		}else{
			redis_cli.lset(uid, 0, req.body.hostname);
			redis_cli.lset(uid, 1, req.body.platform);
			redis_cli.lset(uid, 2, req.body.totalmem);
			redis_cli.lset(uid, 3, req.body.cpucount);

			//	send apps list to agent
			{
				var key = uid + '_APPS';
				var body = req.body;
				redis_cli.lrange(key,0,-1,function(err,reply){
					if(err){
						console.log(err);
						res.send( {'error':'no list'});
					}else{
						//	update info
						res.send( {'apps': reply});
					}
				});
			}
		}
	});
};

exports.agtRecv_UpdateInfo = function(req,res){
	if(	req.body.uid == undefined || 
		req.body.uptime == undefined || 
		req.body.cpuload == undefined || 
		req.body.freemem == undefined
	){
		console.log(err);
		res.send( {'error':'application error -1027'});
		redis_cli.quit(function(err,reply){});
		return;
	}
	
	var uid = req.body.uid;
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	redis_cli.lset(uid, 6, req.body.uptime, function(err,reply){
		if(err){
			console.log(err);
			res.send( {'error':'application error -1028'});
		}else{
			redis_cli.lset(uid, 7, req.body.freemem);
			redis_cli.lset(uid, 9, req.body.cpuload);
			if( req.body.apps != undefined){
				redis_cli.lset(uid, 10, req.body.apps);
			}
			if( req.body.net_recv != undefined){
				redis_cli.lset(uid, 11, req.body.net_recv, function(err,ret){
					if(err)
					{
						console.log(err);
						redis_cli.rpush(uid, 'net_recv');
						redis_cli.rpush(uid, 'net_send');
					}
				});
			}else{
				console.log( 'no net_recv data! >> ' + uid);
			}
			if( req.body.net_send != undefined){
				redis_cli.lset(uid, 12, req.body.net_send, function(err,ret){
					if(err){
						console.log(err);
						redis_cli.rpush(uid, 'net_recv');
						redis_cli.rpush(uid, 'net_send');
					}
				});
			}else{
				console.log( 'no net_send data! >> ' + uid);
			}
			res.send( {'error':'0'});
		}
	});
};
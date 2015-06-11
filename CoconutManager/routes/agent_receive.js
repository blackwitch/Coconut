var redis = require('redis');
var cfg = require('../config');
var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());

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
	redis_cli.exists(uid,function(err,reply){
		if(err){
			console.log(err);
			res.send( {'error':'application error -1025'});
			return;
		}

		if(reply == 0){	//	regist this server
			redis_cli.sadd('servers',uid, function(err, reply){
				if(err){
					console.log(err);
					res.send( {'error':'application error -1026'});
					return;
				}else{
					//	save info
					{	//	delete old data
						var appKey = uid + '_APPS';
						redis_cli.del(appKey);
					}

					redis_cli.hset(uid, "hostname", req.body.hostname, redis.print);
					redis_cli.hset(uid, "platform", req.body.platform);
					redis_cli.hset(uid, "totalmem", req.body.totalmem);
					redis_cli.hset(uid, "cpucount", req.body.cpucount);
					redis_cli.hset(uid, "nick", 'nick_name');
					redis_cli.hset(uid, "group", 'group_name');
					redis_cli.hset(uid, "uptime", '0');
					redis_cli.hset(uid, "freemem", '0');
					redis_cli.hset(uid, "freedisk", '0');
					redis_cli.hset(uid, "cpuload", '0');
					redis_cli.hset(uid, "apps", 'no apps');
					redis_cli.hset(uid, "net_recv", 'net_recv');
					redis_cli.hset(uid, "net_send", 'net_send');
					
					res.send( {'error':'0'});
				}
			});
		}else{
			redis_cli.hset(uid, "hostname", req.body.hostname);
			redis_cli.hset(uid, "platform", req.body.platform);
			redis_cli.hset(uid, "totalmem", req.body.totalmem);
			redis_cli.hset(uid, "cpucount", req.body.cpucount);

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
		return;
	}
	
	var uid = req.body.uid;

	redis_cli.hset(uid, "uptime", req.body.uptime);
	redis_cli.hset(uid, "freemem", req.body.freemem);
	redis_cli.hset(uid, "cpuload", req.body.cpuload);
	if( req.body.apps != undefined){
		redis_cli.hset(uid, "apps", req.body.apps);
	}
	if( req.body.net_recv != undefined){
		redis_cli.hset(uid, "net_recv", req.body.net_recv);
		redis_cli.hset(uid, "net_send", req.body.net_send);
	}
};
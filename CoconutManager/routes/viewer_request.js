var child_proc = require('child_process');
var redis = require('redis');
var rpcForCli = require('json-rpc2');
var cfg = require('../config');

exports.srv_list = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());

	redis_cli.smembers('servers',function(err,reply){
		if(err){
			console.log("srv_list error 001 : " + err);
			redis_cli.quit(function(err,res){});
			res.send( {'error':'404'});
			return;
		}
		redis_cli.quit(function(err,res){});
		res.send(reply);
	});
};

exports.srv_info = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	
	redis_cli.hgetall(req.body.uid,function(err,reply){
		if(err){
			console.log(err);
			redis_cli.quit(function(err,res){});
			res.send( {'error':'404'});
			return;
		}
		redis_cli.quit(function(err,res){});
		var ret = {'uid':req.body.uid, 'arrIdx':req.body.arrIdx, 'info':reply};
		res.send(ret);
	});
};

exports.srv_ps_list = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	
	var client = rpcForCli.Client.$create(cfg.getPortAgentRpc(),req.body.ip);
	
	client.call('ps', [],function(err,reply){
		if(err){
			console.log('ps request error : ' + err);
			res.send(err);
		}else{
			res.send(reply);
		}
	});
};

exports.srv_registed_app_list = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());

	var key = req.body.uid + '_APPS';
	redis_cli.lrange(key,0,-1,function(err,reply){
		if(err){
			console.log(err);
			redis_cli.quit(function(err,res){});
			res.send( {'error':'no list'});
			return;
		}
		var ret = {'uid':req.body.uid, 'list':reply};
		res.send(ret);
	});
};

exports.srv_regist_app_update = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	var key = req.body.uid + '_APPS';

	// 	내용 작업할 것!
	redis_cli.del(key, function(err, reply){
		if(err){
			res.send({'error':err});
		}else{
			if(req.body.list == undefined){
				res.send({'ret':'deleted all apps'});
			}else{
				var multi = redis_cli.multi();
				for(var i=0;i<req.body.list.length;i++)
					multi.rpush(key, req.body.list[i]);
				var sendData = req.body.list;
				multi.exec(function(error, replyAdd){
					if(err){
						res.send({'error':error});
					}else{
						res.send({'ret':replyAdd});
						{	//	send the agent updated app list
							//	must fix to get server ip from uid
							var client = rpcForCli.Client.$create(cfg.getPortAgentRpc(),req.body.uid.replace('IP_',''));
							client.call('update_apps', sendData);
						}
					}
				});
			}
		}
	});
};


exports.srv_remove = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	
	redis_cli.srem('servers',req.body.uid, function(err, reply){
		if(err){
			console.log('err >> ' + err);
			res.send( {'error':'404'} );
			redis_cli.quit(function(err,res){});
		}else{
			redis_cli.del(req.body.uid, function(err,reply){
				if(err){
					console.log('err >> ' + err);
					res.send( {'error':'404'} );
				}else{
					var ret = {'arrIdx': req.body.arrIdx, 'uid':req.body.uid, 'info':reply};
					res.send(ret);
				}
				redis_cli.quit(function(err,res){});
			});
		}
	});
};

exports.srv_getrtinfo = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	
	redis_cli.hmget(req.body.uid,'cpuload', 'apps', 'freemem', 'net_recv', 'net_send',function(err,reply){
		if(err){
			console.log(err);
			redis_cli.quit(function(err,res){});
			res.send( {'error':'404'});
			return;
		}
		redis_cli.quit(function(err,res){});
		var data = {'arrIdx': req.body.arrIdx, 'uid':req.body.uid, 'cpuload':reply[0], 'apps':reply[1], 'freemem': reply[2], 'net_recv':reply[3], 'net_send':reply[4]};
		res.send(data);
	});
};

exports.modify_group = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());

	console.log("this is modify_group!");
	console.log(req.body.uid);
	console.log(req.body.nick);

	redis_cli.hset(req.body.uid, "group",req.body.nick, function(err,reply){
		if(err){
			console.log(req.body.uid);
			console.log(req.body.nick);
			console.log(err);
			redis_cli.quit(function(err,res){});
			res.send( {'error':'404'});
			return;
		}
		redis_cli.quit(function(err,res){});
		res.send( {'error':'0', 'newnick':req.body.nick});
	});
};

exports.modify_nick = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var redis_cli = redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
	
	console.log("this is modify_nick!");
	console.log(req.body.uid);
	console.log(req.body.nick);

	redis_cli.hset(req.body.uid, "nick", req.body.nick, function(err,reply){
		if(err){
			console.log(req.body.uid);
			console.log(req.body.nick);
			console.log(err);
			redis_cli.quit(function(err,res){});
			res.send( {'error':'404'});
			return;
		}
		redis_cli.quit(function(err,res){});
		res.send( {'error':'0', 'newnick':req.body.nick});
	});
};

exports.dist_repo_update = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	
	if(req.body.servers === undefined || req.body.servers.length == 0){
		res.send( {'error':'-1', 'message':'no server'});
		return;
	}

	var errlist = [];
	var succlist = [];
	var count = 0;
	var disconnectError = 0;
	for(var i=0; i<req.body.servers.length; i++){
		var agentIP = req.body.servers[i].replace('IP_','');
		console.log( 'try to connect to ' + agentIP);
		var client = rpcForCli.Client.$create(cfg.getPortAgentRpc(),agentIP);
		client.call('download', [req.body.target_path, req.body.dist_repo_path, req.body.isAll],function(err,reply){
			if(err){
				console.log('ps request error : ' + err);
				if(reply === undefined){
					disconnectError++; 
					console.log('connect error ip : ' + client.host);
				}
				errlist.push(client.host);
				
			}else{
				succlist.push(client.host);
			}
			
			++count;
			if(count == req.body.servers.length)
			{
				console.log('errlist >> ' + errlist);
				console.log('succlist >> ' + succlist);
				res.send({'errlist':errlist, 'succlist':succlist});
			}
		});
	}
};

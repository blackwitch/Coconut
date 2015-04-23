var md5 = require('MD5');
var cfg = require('../config');
var redis = require('./util_redis');
var chkSession = require('./util_session');

// Add your methods 
exports.system_describe = function(args,opt, callback) {
  var error, result;
  
  // Add 2 or more parameters together 
  if (args.length === 0) {
    result = {code : 0, message : "Welcome Test Control Server"};
  }else {
    result = { code: -32602, message: "Invalid id or pw!!" };
  }
 
  callback(error, result);
}

exports.login = function(args, opt, callback) {
  // Add 2 or more parameters together 
  if (args.length === 2) {
    var result = md5(args[0] + ":" + args[1]);
	var redis_cli = redis.getClient(cfg.getPortRedis(),cfg.getIpRedis());
	redis_cli.lrange(result,0,-1,function(err,reply){
		if(err){
			console.log(err);
			redis.close(redis_cli);
			callback(null, 'login error!!');
			return;
		}
		if(reply.length == 0){	//	regist this server
			//	save info
			console.log(' new admin ' + args[0] );
			redis_cli.rpush(result, args[0]);	//	id
			redis_cli.rpush(result, '');		//	last controlled ip
			redis_cli.expire(result, 300);		//	expire this key 5 mins later
			redis.close(redis_cli);
			callback(null, result);
		}else{
			//	update info
			console.log(' update admin ' + args[0] );
			redis_cli.expire(result, 300);		//	extend the expire time of this key 5 mins later
			redis.close(redis_cli);
			callback(null, result);
		}
	});
  }else {
	callback(null, 'Invalid id or pw!!');
  }
}

exports.connect = function (args, opt, callback) {
	chkSession.checkSession(args, function(_args, err, reply){
		if(err){
			callback(null,err.msg);
			return;
		}else{
			//	update info
			if(args.length != 2){
				callback(null,'Invalid arguments!');
				return;
			}else{
				var ctrlUUID = 'IP_' + _args[1];
				var redis_cli = redis.getClient(cfg.getPortRedis(),cfg.getIpRedis());
				redis_cli.lrange(ctrlUUID,0,-1,function(err,replyCtrlUUID){
					if(err){
						redis.close(redis_cli);
						callback(null, '[' + _args[1] + '] server is not exist.');
						return;
					}
					if(replyCtrlUUID.length == 0){	//	regist this server
						redis.close(redis_cli);
						callback(null, _args[1] + ' is not existed');
						return;
					}else{
						redis_cli.lset(_args[0], 1, _args[1]);
						redis.close(redis_cli);
						callback(null, 'connected >> ' + _args[1]);
						return;
					}
				});
			}
		}
	});
}
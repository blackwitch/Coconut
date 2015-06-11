var cfg = require('../config');
var redis = require('./util_redis');
var redis_cli = redis.getClient(cfg.getPortRedis(),cfg.getIpRedis());

exports.checkSession = function(args, callback){
	if(args.length === 0)
	{
		callback( args, {'msg':'no args..'}, null);
		return;
	}

	redis_cli.lrange(args[0],0,-1,function(err,reply){
		if(err){
			callback(args, { 'msg': 'Invalid session data!!' }, null);
			return;
		}
		
		if(reply[0] === undefined)
		{
			callback(args, { 'msg': 'Invalid session data!!' }, null);
			return;
		}
		
		//	modify the expire time of this key 5 mins later
		redis_cli.expire(args[0], 300,function(err, flagDidSet){ 
			callback(args, null, {'id':reply[0], 'lastServer':reply[1]});
		});		
	});
}
var redis = require('redis');
var cfg = require('../config');

exports.getClient = function(port, ip){
	return redis.createClient(cfg.getPortRedis(),cfg.getIpRedis());
}

exports.close = function ( _client ){
	_client.quit(function(err,res){});
}
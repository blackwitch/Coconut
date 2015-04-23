var rpc = require('json-rpc2');
var cfg = require('../config');
var chkSession = require('./util_session');

exports.whoru = function(args, opt, callback) {
	chkSession.checkSession(args, function(_args, err, reply){
		if(err){
			callback(null,err.msg);
			return;
		}else{
			var result;
			if(reply.lastServer == '')
				result = 'Hi! [' + reply.id + '] You did not connect any server. You have to use the command [connect]';
			else
				result = 'Hi! [' + reply.id + '] You are controlling the server ['+reply.lastServer +'].';
			callback(null, result);
		}
	});
}

function command(command, args, opt, callback) {
	chkSession.checkSession(args, function(_args, err, reply){
		if(err){
			callback(null,err.msg);
			return;
		}else{
			_args.shift();	//	첫번째 인자는 버린다.
			var client = rpc.Client.$create(cfg.getPortAgentRpc(),reply.lastServer);
			console.log( 'cmd >> ' + command + ', _args >> ' + _args);
			client.call(command, _args,function(err,result){
				if(err){
					callback(null, 'I guess the server is offline.');
				}else{
					callback(null, result);
				}
			});
		}
	});
}

exports.pwd = function(args, opt, callback) {
	command('pwd', args, opt, callback);
}

exports.cd = function(args, opt, callback) {
	command('cd', args, opt, callback);
}

exports.mkdir = function(args, opt, callback) {
	command('mkdir', args, opt, callback);
}

exports.rmdir = function(args, opt, callback) {
	command('rmdir', args, opt, callback);
}

exports.del = function(args, opt, callback) {
	command('rm', args, opt, callback);
}

exports.rm = function(args, opt, callback) {
	command('rm', args, opt, callback);
}

exports.curl = function(args, opt, callback) {
	command('curl', args, opt, callback);
}

exports.ls = function(args, opt, callback) {
	command('ls', args, opt, callback);
}

exports.tail = function(args, opt, callback) {
	command('tail', args, opt, callback);
}

exports.find = function(args, opt, callback) {
	command('find', args, opt, callback);
}

exports.svn = function(args, opt, callback) {
	command('svn', args, opt, callback);
}


/*
exports.bash = function(args, opt, callback) {
	chkSession.checkSession(args, function(_args, err, reply){
		if(err){
			callback(null,err.msg);
			return;
		}else{
			_args.shift();	//	첫번째 인자는 버린다.
			var client = rpc.Client.$create(5090,reply.lastServer);
			client.call('bash', _args,function(err,result){
				if(err){
					callback(null, 'I guess the server is offline.');
				}else{
					callback(null, result);
				}
			});
		}
	});
}
*/
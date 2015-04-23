var child_proc = require('child_process');
var redis = require('redis');
var rpcForCli = require('json-rpc2');
var cfg = require('../config');

exports.cmd_start = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');

	var client = rpcForCli.Client.$create(cfg.getPortAgentRpc(),req.body.ip);
	
	client.call('procCtrl', ['start',req.body.ip, req.body.cmd, req.body.args],function(err,reply){
		if(err){
			console.log('procCtrl start request error : ' + err);
			res.send(err);
		}else{
			res.send(reply);
		}
	});
};

exports.cmd_stop = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');

	var client = rpcForCli.Client.$create(cfg.getPortAgentRpc(),req.body.ip);
	
	client.call('procCtrl', ['stop', req.body.ip, req.body.pid],function(err,reply){
		if(err){
			console.log('procCtrl stop request error : ' + err);
			res.send(err);
		}else{
			res.send(reply);
		}
	});
};

exports.cmd_restart = function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');

	var client = rpcForCli.Client.$create(cfg.getPortAgentRpc(),req.body.ip);
	
	client.call('procCtrl', ['restart',req.body.ip, req.body.pid, req.body.cmd, req.body.args],function(err,reply){
		if(err){
			console.log('procCtrl restart request error : ' + err);
			res.send(err);
		}else{
			res.send(reply);
		}
	});
};

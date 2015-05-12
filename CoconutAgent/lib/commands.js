var fs   = require('fs'),
	os	 = require('os'),
    io   = require('socket.io'),
    util = require('util'),
    psnode= require('ps-node'),
    spawn= require('child_process').spawn;
 var IS_WIN = process.platform === 'win32';
	
exports.pwd = function(args, opt, callback) {
	console.log( process.cwd() );
	callback( null, process.cwd() );
}

exports.cd = function(args, opt, callback) {
	process.chdir(args[0]);
	callback( null, process.cwd() );
}

exports.mkdir = function(args, opt, callback) {
	console.log( 'mkdir ' + args);
	fs.mkdir(args[0], function (err) {
		if (err) callback(null,err);
		else callback(null, args[0] + ' folder is created!');
	});	
}
exports.rmdir = function(args, opt, callback) {
	fs.rmdir(args[0], function (err) {
		if (err) callback(null,err);
		else callback(null, args[0] + ' folder is deleted!');
	});	
}
exports.rm = function(args, opt, callback) {
	fs.unlink(args[0], function (err) {
		if (err) callback(null,err);
		else callback(null, args[0] + 'is deleted!');
	});	
}
exports.tail = function(args, opt, callback) {
	if( IS_WIN){
		callback(null,'It does not support this command yet');
	}else{
		var cmd = spawn('tail',args);
		cmd.stdout.setEncoding('utf8');
		var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.
		
		cmd.stdout.on('data', function(data){
			result += data;
		});
		cmd.stdout.on('end', function(data){
			callback(null, result);
		});		
		cmd.stderr.on('data', function(data){
			result += data;
		});
		cmd.on('exit', function(data){
			result += data;
		});
	}	
}
exports.find = function(args, opt, callback) {
	if( IS_WIN){
		callback(null,'It does not support this command yet');
	}else{
		var cmd = spawn('find',args);
		cmd.stdout.setEncoding('utf8');
		var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.
		
		cmd.stdout.on('data', function(data){
			result += data;
		});
		cmd.stdout.on('end', function(data){
			callback(null, result);
		});		
		cmd.stderr.on('data', function(data){
			result += data;
		});
		cmd.on('exit', function(data){
			result += data;
		});
	}	
}

exports.procCtrl = function(args, opt, callback) {
	console.log(args);

	switch(args[0])
	{
		case 'start':{
			var exec= require('child_process').exec;
	        var cmd = exec(args[2], args[3]);
	        callback(null, {'ret':'OK'});
		}
		break;
		case 'stop':{
			psnode.kill(args[2], function(err){
				if(err)
					callback(null, {'error':err});
				else
					callback(null, {'ret':'OK'});
			});
		}
		break;
		case 'restart':{
			psnode.kill(args[2], function(err){
				if(err)
					callback(null, {'error':err});
				else{
					var exec= require('child_process').exec;
			        var cmd = exec(args[2], args[3]);
			        callback(null, {'ret':'OK'});
				}
			});

		}
		break;
	}
}


exports.svn = function(args, opt, callback) {
	var cmd = spawn('svn', args);

	cmd.stdout.setEncoding('utf-8');
	var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.

	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data);
		result += data;
	});
	cmd.stdout.on('end', function(data){
		callback(null, result);
	});		
	cmd.stderr.on('data', function(data){
		console.log('stderr: ' + data);
		result += data;
		//callback(null, data);
	});
}

exports.curl = function(args, opt, callback) {

	var cmd = spawn('curl', ['-O', args[0]]);

	cmd.stdout.setEncoding('utf-8');
	var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.

	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data);
		result += data;
	});
	cmd.stdout.on('end', function(data){
		callback(null, result);
	});		
	cmd.stderr.on('data', function(data){
		console.log('stderr: ' + data);
		result += data;
		//callback(null, data);
	});
}

exports.ls = function(args, opt, callback) {
	if( IS_WIN){
		//var exec = require('child_process').exec;
		/*var child = exec('dir', function(err, stdout, stderr){
			if(err)	console.log('err >>' + err);
			else	callback(null, stdout);
		});*/
		var cmd = spawn(process.env.comspec, ['/c','dir']);
		cmd.stdout.setEncoding('utf-8');
		var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.

		cmd.stdout.on('data', function(data){
			console.log('stdout: ' + data);
			result += data;
		});
		cmd.stdout.on('end', function(data){
			callback(null, result);
		});		
		cmd.stderr.on('data', function(data){
			console.log('stderr: ' + data);
			result += data;
			//callback(null, data);
		});
	}else{
		console.log( 'call bash');
		var cmd = spawn('ls', ['-al']);
		cmd.stdout.setEncoding('utf8');
		var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.
		
		cmd.stdout.on('data', function(data){
			result += data;
		});
		cmd.stdout.on('end', function(data){
			callback(null, result);
		});		
		cmd.stderr.on('data', function(data){
			result += data;
		});
		cmd.on('exit', function(data){
			result += data;
		});
	}
}

exports.ps = function(args, opt, callback){
	psnode.lookup({
		command:'',	//	없으면 모든 process를 볼 수 있다.
		psargs:'ux'
	}, function(err,psList){
		if(err)
			callback(err, null);
		else
		{
			for(var i=0;i<psList.length;){
				if(psList[i].command == '')
				{
					psList.splice(i,1);
				}else
				{
					psList[i].command = psList[i].command.replace(/"/gi,'');
					++i;
				}
			}
			callback(null, psList);
		}
	});
}

exports.bash = function(para, callback){
	var spawn = child_proc.spawn;
	var cmd = spawn('ls', []);
	var result = '';	//	다중 호출시 문제됨. 0-0 윈도우에서 stdout이 두번 호출되며 두번째에 상세 결과가 있기 때문에 일단 임시로 이렇게 처리하자.
	
	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data);
	});
	
	cmd.stderr.on('data', function(data){
		console.log('stderr: ' + data);
		//callback({'error' : data}, {'ip':ip});
	});
	
	cmd.on('exit', function(data){
		console.log('exit: ' + data);
		//callback(null, data);
	});
}


/*		file download sample
		var exec = require('child_process').exec;
		var child = exec('curl http://localhost/test.jpg', function(err
		,stdout,stderr){
			if(err)	console.log('err >>' + err);
			else{
				var file = fs.createWriteStream('./test.jpg');
				file.write(stdout);
				console.log(stdout);
				callback(null, 'complete');
			}
		});
*/		
/*		var child = spawn('curl',' http://localhost/test.jpg');
		console.log(' spawn ');
		child.stdout.on('data', function(reply){
			console.log(reply);
		});
		child.stdout.on('end', function(reply){
			console.log(reply);
		});
		child.stderr.on('data', function(reply){
			console.log(reply);
		});
		child.on('exit', function(reply){
			console.log(reply);
		});
*/

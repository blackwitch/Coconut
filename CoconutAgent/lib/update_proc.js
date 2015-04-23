var child_proc = require('child_process');

exports.download = function(para, ip, callback){
	var spawn = child_proc.spawn;
	var cmd = spawn('curl', ['-O', para[1]]);
	
	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data);
	});
	
	cmd.stderr.on('data', function(data){
		console.log('stderr: ' + data);
		// callback({'error' : data}, {'ip':ip});
	});
	
	cmd.on('exit', function(data){
		console.log('exit: ' + data);
		callback(null, {'ip':ip, 'ret' : data});
	});
}

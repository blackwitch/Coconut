var child_proc = require('child_process');
var fs = require('fs');

exports.download = function(para, ip, callback){
	
	if(para.length != 2){
		console.log( "params are incorrect!!" );
		callback({'error' : 'params are incorrect!!'}, {'ip':ip});
		return;
	}

	var dirList = para[0].split(/[\/]+/);
	console.log( dirList );
	var checkFolder = '';
	for(var i=0;i< dirList.length;i++){
		checkFolder += dirList[i] + '/';
		if(fs.existsSync( checkFolder)){
			console.log( checkFolder + " is existed!");
		}else{
			console.log( checkFolder + " is not existed!");
			fs.mkdirSync(checkFolder);
		}
	}

	var fn = para[1].split(/[\/]+/);
	var saveFn = para[0] + '/' + fn[ fn.length-1];

	var spawn = child_proc.spawn;
	var cmd = spawn('curl', ['-o' , saveFn , para[1]]);
	
	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data);
	});
	
	cmd.stderr.on('data', function(data){
		console.log('stderr: ' + data);
		// callback({'error' : data}, {'ip':ip});
	});
	
	cmd.on('exit', function(data){
		console.log('exit: ' + data);
		callback(null, {'ret' : data});
	});
}

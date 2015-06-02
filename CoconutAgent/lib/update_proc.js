var child_proc = require('child_process');
var fs = require('fs');
var http = require('http');
var request = require('request');

function downloadRemoteFile(saveFn,remote_addr,cb){
	var spawn = child_proc.spawn;
	var cmd = spawn('curl', ['-o' , saveFn , remote_addr]);
	
	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data);
	});
	
	cmd.stderr.on('data', function(data){
		console.log('stderr: ' + data);
	});
	
	cmd.on('exit', function(data){
		cb(null, {'ret' : data});
	});
}

function mkdir(tarDir, where, remote_where, isAll){
	var ret = '';
	for(var r in where){
		var tar = tarDir+'/'+where[r].name;
		try{
			if(where[r].size == undefined){	//	this is a folder
				if(false == fs.existsSync( tar) ){
					fs.mkdirSync( tar);
				}
				if(where[r].folder != undefined ){
					ret += mkdir(tar, where[r].folder, remote_where+'/'+where[r].name,isAll);
				}
			}else {	//	this is a file
				if(true == fs.existsSync( tar) ){
					var stat = fs.statSync(tar);
					if( isAll== 1 || stat.size  !=  where[r].size){
						downloadRemoteFile(tar, remote_where+'/' + where[r].name, function(err,res){
							ret += '\r\n >>>>>>>>>>> ' + res;	//	Currently, this code is no meaning.
						});
					}
				}else{
					downloadRemoteFile(tar, remote_where+'/' + where[r].name, function(err,res){
							ret += '\r\n >>>>>>>>>>> ' + res;	//	Currently, this code is no meaning.
						});
				}
			}
		}catch(err){
			ret += '\r\n >>>>>>>>' + err;
		}
	}

	console.log( 'ret >> '+ ret);
	return ret;
}

function makeDir(tarDir, where,remote_where, isAll, cb){
	return cb( mkdir(tarDir, where,remote_where, isAll) );
}

function isRemoteFile(addr){
	if( addr[addr.length-1] == '/' ){	//	I know, this is xxit, I'll fix this if I'll be known to check attribute about remote file/dir.
		return false;
	}
	return true;
}

function checkURL(_addr, cb){
	downloadRemoteFile("./test.txt" , _addr, function (err,data){
		fs.unlink("./test.txt");
		cb(err,data);
	});
}

exports.download = function(para, callback){
	
	if(para.length != 3){
		callback({'error' : 'params are incorrect!!'});
		return;
	}

	if( isRemoteFile(para[1]) == true ){
		var dirList = para[0].split(/[\/]+/);
		var checkFolder = '';
		for(var i=0;i< dirList.length;i++){
			checkFolder += dirList[i] + '/';
			if(false == fs.existsSync( checkFolder)){
				fs.mkdirSync(checkFolder);
			}
		}

		var fn = para[1].split(/[\/]+/);
		var saveFn = para[0] + '/' + fn[ fn.length-1];

		downloadRemoteFile(saveFn , para[1], function (err, data){
			callback(err, {'ret' : data});
		});
	}else{
		var url  = para[1];
		checkURL(url, function(err,resp){
			if(resp.ret != 0 )
			{
				console.log( "remote sync error : code" + resp.ret);
				callback(null, {'error':'error code [' + resp.ret + ']'});
			}else{
				http.get(url + 'repoList.json').on('response',function(res){
					var body = '';
					var i=0;
					res.on('data', function(chunk){
						i++;
						body += chunk;
					});
					res.on('end',function(){
						if(body[0] == '[' && body[1] == '{')
						{
							var repoList = JSON.parse( body);
							makeDir( para[0], repoList, para[1], para[2], function(ret){
								if( ret.indexOf('Error') > 0 )
									callback(ret, {'ret' : ret});
								else
									callback(null, {'ret' : ret});
							});
						}else{
							console.log('There is no repoList.json file!');
							callback('There is no repoList.json file!', {'ret' : 'There is no repoList.json file!'});
						}
					});
				});
			}
		});
	}
}

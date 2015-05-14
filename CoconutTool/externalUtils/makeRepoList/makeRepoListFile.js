var fs = require('fs');

var data=[];
var readDir = function(_path, _data, callback){
	var files = fs.readdirSync(_path);
	if(files.length > 0 && callback == undefined){
		_data["folder"] = [];
		_data = _data["folder"];
	}

	var index = 0;
	files.forEach(function(file){
        var  path = _path+'/'+file;
        var stat = fs.statSync(path);
        if(true == stat.isDirectory()){
        	_data[index] = {"name" : file};
        	readDir(path,_data[index]);
        	++index;
        }else{
        	if(file != "makeRepoListFile.js" &&
        	   file != "repoList.json"){
	        	_data[index] = {"name" : file, "size" : stat.size};
	        	++index;
        	}
        }
    });

    if(callback != undefined)
    	callback(_data);
}

readDir('./', data, function(res){
	fs.writeFile("./repoList.json", JSON.stringify(res), function(err){
		if(err)
			return console.log( 'ERROR !! >> ' + err );
		console.log(" repoList.json was created!");
	} );
});




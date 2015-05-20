module.exports = function setup(options, imports, register) {

var scheduler = require('node-schedule');
var pb = require('pushbullet');
var pusher = new pb('INPUT-Your-PushBullet-Access-KEY');

var tsRule0 = new scheduler.RecurrenceRule();
tsRule55.second = 55;	//	send system info per 1min
scheduler.scheduleJob(tsRule55, function(){
	
	pusher.devices(function(error, response){
		if(error)
			console.log('plugin ERROR: ' + error);
		else{
			console.log('plugin send to pushbullet: ');
			pusher.note( response.devices[0].iden,'test message', 'Hi there! This is test message of Coconut Manager. I recommand to remove this example if you receive this message. Have a nice day!!', function(error, resp){
				if(error)
					console.log('plugin ERROR: ' + error);
				else{
					console.log('plugin result to pushbullet: ');
					console.log( resp );
				}
			});
		}
	});
	
});

};
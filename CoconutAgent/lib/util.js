var os = require('os');

///////////////////////////////
//	create uuid (NOW, return last ip address)
//	have to find a solution to make uuid even if the system is a docker container.
//	but... the problem is a docker because that is rebuild sometimes.
//	the '--lxc-conf="lxc.network.hwaddr=' option of docker's 'run' command is not awsome I think ~ 
exports.generateUUID = function () {
	var lastIp='';
	var iflist = os.networkInterfaces();
	Object.keys(iflist).forEach(function (ifname) {
		var alias = 0;
		iflist[ifname].forEach(function (ifinfo) {
			if (false != ifinfo.internal  || 'IPv4' !== ifinfo.family) {
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
			} else {
				// this interface has only one ipv4 address
			}
			
			lastIp = 'IP_'+ifinfo.address;
		});
	});
	
	return lastIp;
}

exports.getIPs = function () {
	var IPs=[];
	var iflist = os.networkInterfaces();
	Object.keys(iflist).forEach(function (ifname) {
		var alias = 0;
		iflist[ifname].forEach(function (ifinfo) {
			if (false != ifinfo.internal  || 'IPv4' !== ifinfo.family) {
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
			} else {
				// this interface has only one ipv4 address
			}
			
			IPs.push(ifinfo.address);
		});
	});
	
	return IPs;
}



//	create uuid
///////////////////////////////
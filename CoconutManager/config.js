var ipRedis = 'localhost';		//	ip address of Redis
var portRedis = 6379;			//	port number of Redis

var ipMng = 'localhost';		//	ip address of Coconut Manager 
var portMngApi = 38150;			//	port number of Coconut Manager 
var portMngFileTransfer = 38250;	//	file transfer port number of Coconut Manager
var portMngInternalHttp = 38080;	//	http port number of Coconut Manager for Coconut Agent
var portMngExternalHttp = 38443;	//	http port number of Coconut Manager for Tool User

var portAgentRpc = 38390;
var portAgentFileTransfer = 38380;


exports.getIpRedis = function() {
	return ipRedis;
}
exports.getPortRedis = function() {
	return portRedis;
}


exports.getIpMng = function() {
	return ipMng;
}
exports.getPortMngApi = function() {
	return portMngApi;
}
exports.getPortMngFileTransfer = function() {
	return portMngFileTransfer;
}
exports.getPortMngInternalHttp = function() {
	return portMngInternalHttp;
}
exports.getPortMngExternalHttp = function() {
	return portMngExternalHttp;
}


exports.getPortAgentRpc = function() {
	return portAgentRpc;
}
exports.getPortAgentFileTransfer = function() {
	return portAgentFileTransfer;
}

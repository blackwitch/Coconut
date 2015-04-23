var ipRedis = '172.31.5.70';	//	ip address of Redis
var portRedis = 6379;			//	port number of Redis

var ipMng = '172.31.5.12';		//	ip address of Coconut Manager 
var portMngApi = 5070;			//	port number of Coconut Manager 
var portMngFileTransfer = 5060;	//	file transfer port number of Coconut Manager
var portMngInternalHttp = 8080;	//	http port number of Coconut Manager for Coconut Agent
var portMngExternalHttp = 8443;	//	http port number of Coconut Manager for Tool User

var portAgentRpc = 5090;
var portAgentFileTransfer = 5080;


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

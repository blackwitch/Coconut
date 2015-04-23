
var ipRedis = '172.31.5.70';
var portRedis = 6379;

var ipMng = '172.31.5.12';
var portMngApi = 5070;
var portMngFileTransfer = 5060;
var portMngInternalHttp = 8080;
var portMngExternalHttp = 8443;

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

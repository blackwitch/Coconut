
var ipRedis = 'localhost';
var portRedis = 38001;

var ipMng = 'localhost';
var portMngApi = 38150;
var portMngFileTransfer = 38250;
var portMngInternalHttp = 38080;
var portMngExternalHttp = 38443;

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

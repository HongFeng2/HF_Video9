var PortIO = 3002;

var WebSocketServerIO = require('ws').Server;
var ws_io = new WebSocketServerIO({ port: PortIO });

var io = {};
io.run = {};
io.ws = "";
io.on = function(key, fn){
    io.run[key] = fn;
};
io.emit = function(send){
    if(!io.ws) Log("io.ws没有");
    Log("ws发送", send);
    io.ws.send(send);
};

ws_io.on('connection', function(ws) {
    Log("IO连接成功");

    io.ws = ws;

    ws.on('message', function(req) {
        Log("接收信息", req);
        let rs = req.split(",");

        if(io.run[rs[0]]){
            Log(rs[0]+" run信息" , io.run);
            io.run[rs[0]](rs);
        }else Log("响应函数没有定义，run-key没有" , io.run);

    });

    ws.on('close', function() {
        Log("断开连接");
    });

});

//Log函数
function Log(t, o1, o2) {
    if(!o1) o1 = "";
    if(!o2) o2 = "";
    console.log("Log:"+t , o1, o2);
}


//数组操作
Array.prototype.indexOf = function(val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i; } return -1; };
Array.prototype.remove = function(val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1); } };
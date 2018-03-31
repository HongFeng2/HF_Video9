var ws;
var ws_if_redo = 0;

// IOClient
function ws_client(url, pa){
    if(!pa) pa = {};
    this.pa = pa;
    this.ws = "";//websocket主类
    this.url = url;

    this.redo = "";
    this.redoTime = 0;//重复连接次数

    this.emit_fn = {};

    window.onunload = function(){
        ws_if_redo = 1;
        ws.ws.close();
    };
    window.onbeforeunload = function(){
        ws_if_redo = 1;
        ws.ws.close();
    };

    this.json2str = function(json){
        let str = "{";
        for(let i in json){
            str+= '"'+i+'":"'+json[i]+'" ,'
        }
        str += ' "t":"str" }';
        return str;
    };

    this.str2json = function(str){
        let json = {};
        try{
            json = eval('(' + str + ')');
        }catch (e){
            Log("接收错误格式消息", str);
        }
        return json;
    }
}

ws_client.prototype.connect = function(fn){

    let _this = this;

    try {
        this.ws = new WebSocket(this.url);
    }catch (e){
        Log("WebSocket 生成错误，try获得",e);
    }

    this.ws.onopen = function(e){
        Log("WebSocket 连接成功", e);
        _this.conn(fn)
    };

    this.ws.onclose = function(e){
        Log("WebSocket断开连接");
        if(!ws_if_redo) {
            Log("WebSocket准备尝试重连", e);
            _this.connect(fn);
        }
    };

    this.ws.onmessage = function(req) {

        let json = _this.str2json(req.data);
        Log("接收信息", json);

        switch (json.type){
            case "conn":

                break;
            case "emit":
                if(!json.key){
                    Log("接收信息没有key，无法运行对应的on", json);
                    return;
                }
                if(!_this.emit_fn[json.key]) {
                    Log(json.key+" ws.on(key, fn)未定义这个执行函数", _this.emit_fn);
                    return;
                }

                _this.emit_fn[json.key](json);
                break;
        }

    };

    if(!this.if_run){
        this.if_run = 1;
        fn();
    }

    if(this.redo) return;
    this.redo = setInterval(function(){
        if(_this.ws.readyState==1) {
            Log("WebSocket 检测连接正常");
            clearInterval(_this.redo);
            _this.redo = "";
            ws_if_redo = 0;
            _this.redoTime = 0;
        }else{
            _this.redoTime++;
            Log("WebSocket 等待连接中", _this.redoTime);
            ws_if_redo = 1;
            _this.ws.close();
            _this.connect(fn);
        }
    }, 2000);

};

ws_client.prototype.conn = function(fn){
    if(!this.pa.id) {
        Log("注册id错误");
        return;
    }
    this.pa.type = "conn";
    this.ws.send(this.json2str(this.pa));
};

ws_client.prototype.emit = function(msg){
    if(!msg.type) msg.type = "emit";
    Log("emit发送", msg);
    this.ws.send(this.json2str(msg));
};

ws_client.prototype.on = function(key, fn){
    this.emit_fn[key] = fn;
};

function Log(t, o1, o2) {
    if(!o1) o1 = "";
    if(!o2) o2 = "";
    console.log("Log-"+t , o1, o2);
}
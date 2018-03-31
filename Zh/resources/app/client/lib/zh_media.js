//////////////////////////////// 视频控制函数 ////////////////////////////////
function Media(id){
    this.m = $(id);
}
Media.prototype.play = function(i, loop){
    if(!this.m.length) return;
    if(i || i===0) this.m[0].currentTime=i;
    if(loop) this.m[0].loop = true;
    //Log("【Media.play】开始播放：（从第"+this.m[0].currentTime+"开始）");
    this.m[0].play();
};
Media.prototype.playAndFn = function(i, fn, unbind){
    if(!this.m.length) return;
    //Log("【Media.stop】：设定视频播放到"+i+"秒后停止播放");
    this.m.bind('timeupdate', function(){
        if(this.m[0].currentTime>=i) {
            //Log("@【Action.stop】=>已播放"+i+"秒：停顿");
            if(unbind) this.m.unbind('timeupdate');
            if(fn) fn(this);
        }
    }.bind(this));
};
Media.prototype.stop = function(i){
    if(!this.m.length) return;
    //Log("【Media.pause】：停止播放");
    if(i || i===0) this.m[0].currentTime=i;
    this.m[0].pause();
};
Media.prototype.stopAndFn = function(i, fn, unbind){
    if(!this.m.length) return;
    //Log("【Media.stop】：设定视频播放到"+i+"秒后停止播放");
    this.m.bind('timeupdate', function(){
        if(this.m[0].currentTime>=i) {
            //Log("@【Action.stop】=>已播放"+i+"秒：停顿");
            if(unbind) this.m.unbind('timeupdate');
            this.pause();
            if(fn) fn();
        }
    }.bind(this));
};

Media.prototype.end = function(fn, unbind){
    if(!this.m.length) return;
    //Log("【Media.end】：视频结束后运行");
    this.m.bind('ended', function(){
        //Log("@【Media.end】：视频结束ended");
        if(unbind) this.m.unbind('ended');
        fn(this);
    }.bind(this));
};

Media.prototype.loopEnd  = function(fn){
    if(!this.m.length) return;
    this.m.bind('playing', function(){
        fn(this.m[0].currentTime, this);
    }.bind(this));

};

Media.prototype.unbind = function(id){
    if(!this.m.length) return;
    //Log("【Media.unbind】：清除所有绑定");
    if(id) this.m.unbind(id);
    else{
        this.m.unbind('ended');
        this.m.unbind('timeupdate');
        this.m.unbind('playing');
    }

};

Media.prototype.para = function(pa){
    for(var p in pa){
        this.m[0][p] = pa[p];
    }
};

Media.prototype.volume = function(num){
    if(!this.m.length) return;
    if(num>1) num = parseInt(num)/100;
    if(!num) num = 0;
    //Log("【Media.unbind】：清除所有绑定");
    if(num || num===0)
        this.m[0].volume = num;
    else return this.m[0].volume;
};

Media.prototype.len = function(){
    if(!this.m.length) return;
    return this.m[0].duration;
};

Media.prototype.time = function(num){
    if(!this.m.length) return;
    //Log("【Media.unbind】：清除所有绑定");
    if(num || num===0) this.m[0].currentTime = num;
    else return this.m[0].currentTime;
};

Media.prototype.loop = function(mk){
    if(mk){
        this.ifLoop = true;
        // this.m[0].loop = true;
    }else{
        this.ifLoop = false;
        // this.m[0].loop = false;
    }
};

Media.prototype.loop_old = function(mk){
    if(mk){
        this.ifLoop = true;
        this.m[0].loop = true;
    }else{
        this.ifLoop = false;
        this.m[0].loop = false;
    }
};
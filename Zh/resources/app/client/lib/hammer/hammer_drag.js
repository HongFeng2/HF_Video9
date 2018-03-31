function HammerDrag(pa) {

    //////////////
    //1.1运用于终端的拖动（修改原来HammerScroll）
    //1.1版只支持竖着拉,横竖拉，reset有大量未完成，position有大量未完成
    this.version = "1.1.0";
    this.version_update = "2015-10-9";

    if(!(this  instanceof HammerDrag)) return new HammerDrag(pa);

    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };
    this.AnimationEndName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

    //结构:<div id="ID"><div class="_box"></div></div>
    //id:拖动框的id或class
    //tp:x,y,all 拖动的类型左右或上下或全部
    //overstop 超出区域是否马上停止，默认false

    this.$dom  = $(pa.id);
    this.body = this.$dom[0];

    this.height = this.$dom.height();
    this.width = this.$dom.width();

    this.$box = this.$dom.find("._box");
    this.box  = this.$box[0];
    this.$box.css({"overflow":"hidden"});
    this.boxW = this.$box.width();
    this.boxH = this.$box.height();
    this.px = parseInt(this.boxW)/10;
    this.py = parseInt(this.boxH)/10;

    this.tp = pa.tp;

    //目前box框处于的位置情况
    this.x = 0;
    this.y = 0;

    //超出区域是否马上停止，默认false
    this.overstop = pa.overstop;

    //建立$hammer类
    this.hammer = new Hammer.Manager(this.body);

    if(pa.tp=="all"){

        alert("HammerDrag 1.1版不支持全位置拖动");
        return;

    }else if(pa.tp=="y"){

        //可移动的最大区域
        if(parseInt(this.boxH)>parseInt(this.height))
            this.h = parseInt(this.boxH)-parseInt(this.height);
        else this.h = 0;

        this.direction = Hammer.DIRECTION_VERTICAL;
        this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
        this.hammer.on("panstart", Hammer.bindFn(this.onPanStartY, this));
        this.hammer.on("panmove", Hammer.bindFn(this.onPanMoveY, this));
        this.hammer.on("panend", Hammer.bindFn(this.onPanEndY, this));

    }else if(pa.tp=="x"){

        //可移动的最大区域
        if(parseInt(this.boxW)>parseInt(this.width))
            this.w = parseInt(this.boxW)-parseInt(this.width);
        else this.w = 0;

        this.direction = Hammer.DIRECTION_HORIZONTAL;
        this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
        this.hammer.on("panstart", Hammer.bindFn(this.onPanStartX, this));
        this.hammer.on("panmove", Hammer.bindFn(this.onPanMoveX, this));
        this.hammer.on("panend", Hammer.bindFn(this.onPanEndX, this));

    }else{

        alert("HammerDrag tp参数设置错误");
        return;

    }

}

//竖向Pan
HammerDrag.prototype.onPanStartY = function(){

    this.box.style.transition = "";
    this.box.style.webkitTransition = "";

};
HammerDrag.prototype.onPanMoveY = function(ev){

    var y = parseInt(ev.deltaY)+parseInt(this.y);

    if(this.overstop){
        if(y>0 || y<-this.y) return;
    }

    var translate = 'translate(0, ' + y + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};
HammerDrag.prototype.onPanEndY = function(ev){

    var y , p;
    //计算缓动距离
    p = parseInt(this.py)*(Math.abs(parseInt(ev.velocity))+1);

    if(parseInt(ev.deltaY)<0) y = parseInt(this.y) + parseInt(ev.deltaY)-p;
    else if(parseInt(ev.deltaY)>0) y = parseInt(this.y)+ parseInt(ev.deltaY)+p;

    if(!y) return;

    if(y>0) {
        y = 0;
        this.y = 0;
    }else if(y<-this.h) {
        y=-this.h;
        this.y = y;
    }else{
        this.y = y;
    }

    this.box.style.transition = "transform .4s ease-out";
    this.box.style.webkitTransition = "transform .4s ease-out";
    var translate = 'translate(0, ' + y + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;



};

//横向Pan
HammerDrag.prototype.onPanStartX = function(){

    this.box.style.transition = "";
    this.box.style.webkitTransition = "";

};
HammerDrag.prototype.onPanMoveX = function(ev){

    var x = parseInt(ev.deltaX)+parseInt(this.x);

    if(this.overstop){
        if(x>0 || x<-this.w) return;
    }

    var translate = 'translate(' + x + 'px , 0)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};
HammerDrag.prototype.onPanEndX = function(ev){

    var x , p;
    p = parseInt(this.px)*(Math.abs(parseInt(ev.velocity))+1);

    if(parseInt(ev.deltaX)<0) x = parseInt(this.x) + parseInt(ev.deltaX)-p;
    else if(parseInt(ev.deltaX)>0) x = parseInt(this.x)+ parseInt(ev.deltaX)+p;

    if(!x) return;

    if(x>0) {
        x = 0;
        this.x = 0;
    }else if(x<-this.w) {
        x=-this.w;
        this.x = x;
    }else{
        this.x = x;
    }

    this.box.style.transition = "transform .4s ease-out";
    this.box.style.webkitTransition = "transform .4s ease-out";
    var translate = 'translate(' + x + 'px , 0)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};


//重新设置HammerDrag
HammerDrag.prototype.reset = function(pa){

    if(pa.width) {
        this.$dom.css("width", pa.width + "px");
        this.width = pa.width;

        if(parseInt(this.boxW)>parseInt(this.width))
            this.w = parseInt(this.boxW)-parseInt(this.width);
        else this.w = 0;
    }
    if(pa.height) {
        this.$dom.css("height", pa.height+"px");
        this.height = pa.height;

        if(parseInt(this.boxH)>parseInt(this.height))
            this.h = parseInt(this.boxH)-parseInt(this.height);
        else this.h = 0;
    }

};

HammerDrag.prototype.box_reset = function(){

    this.boxW = this.$box.width();
    this.boxH = this.$box.height();

    if(parseInt(this.boxW)>parseInt(this.width))
        this.w = parseInt(this.boxW)-parseInt(this.width);
    else this.w = 0;

    if(parseInt(this.boxH)>parseInt(this.height))
        this.h = parseInt(this.boxH)-parseInt(this.height);
    else this.h = 0;


};

//设置拖动框的相对位置
HammerDrag.prototype.position = function(pa){

    if(!pa){
        return {x:this.x , y:this.y}
    }else{

        pa.x = parseInt(pa.x);
        pa.y = parseInt(pa.y);

        if(pa.x || pa.x===0){
            if(!pa.no_mov){
                this.box.style.transition = "transform .4s ease-out";
                this.box.style.webkitTransition = "transform .4s ease-out";
            }
            var translate = 'translate(' + pa.x + 'px , 0)';
            this.box.style.transform = translate;
            this.box.style.webkitTransform = translate;
            this.x = pa.x;
        }

        if(pa.y || pa.y===0){
            if(!pa.no_mov){
                this.box.style.transition = "transform .4s ease-out";
                this.box.style.webkitTransition = "transform .4s ease-out";
            }
            var translate = 'translate(0 , ' + pa.y + 'px)';
            this.box.style.transform = translate;
            this.box.style.webkitTransform = translate;
            this.y = pa.y;
        }
    }

};
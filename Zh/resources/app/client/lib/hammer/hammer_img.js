function HammerImg(id, xx, xy) {

    //if(!(this  instanceof HammerScroll)) return new HammerScroll(id);
    this.id = id;
    this.$doms  = $(id);
    this.$dom = [];
    this.hammer = [];
    this.$box = [];

    this._this = [];

    for(var i=0; i<this.$doms.length; i++){
        this.$dom[i] = $(this.$doms[i]);
        this.hammer[i] = new Hammer.Manager(this.$doms[i]);
        var c = this.$dom[i].html();
        this.$dom[i].html("<div class='HammerImg_Box'>"+c+"</div>").css({"overflow":"hidden"});

        this.$box[i] = this.$dom[i].find(".HammerImg_Box");
        this.$box[i].css({"position": "relative"});

        this._this[i] = {};
        this._this[i].xx = xx;
        this._this[i].xy = xy;

        this._this[i].$dom = this.$dom[i];
        this._this[i].$box = this.$box[i];
        this._this[i].box = this.$box[i][0];

        this._this[i].box_h = this.$dom[i].height();
        this._this[i].dom_h = this.$dom[i].height();
        this._this[i].box_w = this.$dom[i].width();
        this._this[i].dom_w = this.$dom[i].width();

        this._this[i].py = parseInt(this._this[i].box_h)/10;
        this._this[i].px = parseInt(this._this[i].box_w)/10;

        this._this[i].h = this._this[i].box_h - this._this[i].dom_h;
        if(this._this[i].h<0) this._this[i].h = 0;
        this._this[i].w = this._this[i].box_w - this._this[i].dom_w;
        if(this._this[i].w<0) this._this[i].w = 0;

        this._this[i].y = 0;
        this._this[i].x = 0;

        this._this[i].width = this._this[i].box_w ;
        this._this[i].height = this._this[i].box_h ;

        this._this[i].pleft = 0;
        this._this[i].ptop = 0;
        this._this[i].pwidth = 0;
        this._this[i].pheight = 0;

        this.ini(i);
    }


}

HammerImg.prototype.ini = function(i){

    this.hammer[i].add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 }));

    this.hammer[i].on("panstart", Hammer.bindFn(this.onPanStart, this._this[i]));
    this.hammer[i].on("panmove", Hammer.bindFn(this.onPanMove, this._this[i]));
    this.hammer[i].on("panend", Hammer.bindFn(this.onPanEnd, this._this[i]));

    this.hammer[i].add(new Hammer.Pinch());
    this.hammer[i].on("pinchmove", Hammer.bindFn(this.onPinch, this._this[i]));
    this.hammer[i].on("pinchend", Hammer.bindFn(this.onPinchEnd, this._this[i]));

};

HammerImg.prototype.reset = function(){


    for(var i=0; i<this.$doms.length; i++){

        this._this[i].box_h = this.$dom[i].height();
        this._this[i].box_w = this.$dom[i].width();

        this._this[i].h = this._this[i].box_h - this._this[i].dom_h;
        if(this._this[i].h<0) this._this[i].h = 0;
        this._this[i].w = this._this[i].box_w - this._this[i].dom_w;
        if(this._this[i].w<0) this._this[i].w = 0;

        this._this[i].y = 0;
        this._this[i].x = 0;

        this._this[i].width = this._this[i].box_w ;
        this._this[i].height = this._this[i].box_h ;

        this._this[i].pleft = 0;
        this._this[i].ptop = 0;
        this._this[i].pwidth = 0;
        this._this[i].pheight = 0;
    }

};

HammerImg.prototype.onPinch = function(ev){
    console.log(ev);
    //console.log(ev.changedPointers, ev.pointers);
    //console.log(ev.pointers[1]);
    // var px= (ev.changedPointers[0].clientX+ev.changedPointers[1].clientX)/2-this.xx;
    // var py = (ev.changedPointers[0].clientY+ev.changedPointers[1].clientY)/2-this.xy;
    var px= (ev.pointers[0].clientX+ev.pointers[1].clientX)/2-this.xx;
    var py = (ev.pointers[0].clientY+ev.pointers[1].clientY)/2-this.xy;
    this.pleft = px*(1-ev.scale) + parseInt(this.x*(ev.scale));
    this.ptop = py*(1-ev.scale) + parseInt(this.y*(ev.scale));
    console.log(ev.scale);
    this.pwidth = this.width * ev.scale;
    this.pheight = this.height * ev.scale;

    this.$box.css({
        width: this.pwidth,
        height: this.pheight,
        "margin-left":this.pleft,
        "margin-top":this.ptop
    });
    console.log(this);
};
HammerImg.prototype.onPinchEnd = function(ev){

    this.width = this.pwidth;
    this.height = this.pheight;

    this.x = this.pleft;
    this.y = this.ptop;


};

HammerImg.prototype.onPanStart = function(ev){

    this.box_h = this.$box.height();
    this.box_w = this.$box.width();

    this.dom_h = this.$dom.height();
    this.dom_w = this.$dom.width();

    this.h = this.box_h - this.dom_h;
    if(this.h<0) this.h = 0;
    this.w = this.box_w - this.dom_w;
    if(this.w<0) this.w = 0;

};
HammerImg.prototype.onPanMove = function(ev){

    var y = parseInt(ev.deltaY)+parseInt(this.y);
    var x = parseInt(ev.deltaX)+parseInt(this.x);

    this.$box.css({
        "margin-left":x,
        "margin-top":y
    });


};
HammerImg.prototype.onPanEnd = function(ev){

    var y , py , x, px;
    //计算缓动距离
    // py = parseInt(this.py)*(Math.abs(parseInt(ev.velocityY))+1);
    // px = parseInt(this.px)*(Math.abs(parseInt(ev.velocityX))+1);
    py = 0;
    px = 0;

    if(parseInt(ev.deltaY)<0) y = parseInt(this.y) + parseInt(ev.deltaY)-py;
    else if(parseInt(ev.deltaY)>0) y = parseInt(this.y)+ parseInt(ev.deltaY)+py;

    if(parseInt(ev.deltaX)<0) x = parseInt(this.x) + parseInt(ev.deltaX)-px;
    else if(parseInt(ev.deltaX)>0) x = parseInt(this.x)+ parseInt(ev.deltaX)+px;

    if(!y && !x) return;

    if(y>0) {
        y = 0;
        this.y = 0;
    }else if(y<-this.h) {
        y=-this.h;
        this.y = y;
    }else{
        this.y = y;
    }

    if(x>0) {
        x = 0;
        this.x = 0;
    }else if(x<-this.w) {
        x=-this.w;
        this.x = x;
    }else{
        this.x = x;
    }

    this.$box.css({
        "margin-left":x,
        "margin-top":y
    });


};

function HammerScroll(id) {

    if(!(this  instanceof HammerScroll)) return new HammerScroll(id);
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
        this.$dom[i].html("<div class='HammerScrool_Box'>"+c+"</div>").css({"overflow":"hidden"});

        this.$box[i] = this.$dom[i].find(".HammerScrool_Box");

        this._this[i] = {};

        this._this[i].y = 0;
        this._this[i].box = this.$box[i][0];
        this._this[i].$box = this.$box[i];
        this._this[i].$dom = this.$dom[i];
        this._this[i].bh = this.$box[i].height();
        this._this[i].dh = this.$dom[i].height();
        this._this[i].h = this._this[i].bh - this._this[i].dh;
        if(this._this[i].h<0) this._this[i].h = 0;
        this._this[i].py = parseInt(this._this[i].bh)/10;
        this.ini(i);
    }


}

HammerScroll.prototype.ini = function(i){

    this.hammer[i].add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 10 }));

    this.hammer[i].on("panstart", Hammer.bindFn(this.onPanStartY, this._this[i]));
    this.hammer[i].on("panmove", Hammer.bindFn(this.onPanMoveY, this._this[i]));
    this.hammer[i].on("panend", Hammer.bindFn(this.onPanEndY, this._this[i]));
};

HammerScroll.prototype.reset = function(){

    for(var i=0; i<this.$doms.length; i++){
        this._this[i].y = 0;
        this._this[i].box = this.$box[i][0];
        var translate = 'translate(0, 0)';
        this._this[i].box.style.transform = translate;
        this._this[i].box.style.webkitTransform = translate;



        this._this[i].bh = this.$box[i].height();
        this._this[i].dh = this.$dom[i].height();
        this._this[i].h = this._this[i].bh - this._this[i].dh;
        if(this._this[i].h<0) this._this[i].h = 0;
        this._this[i].py = parseInt(this._this[i].bh)/10;
    }
};

//竖向Pan
HammerScroll.prototype.onPanStartY = function(){
    this.box.style.transition = "";
    this.box.style.webkitTransition = "";

    var translate = 'translate(0, 0)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

    this.bh = this.$box.height();
    this.dh = this.$dom.height();
    this.h = this.bh - this.dh;
    if(this.h<0) this.h = 0;
    this.py = parseInt(this.bh)/10;

};
HammerScroll.prototype.onPanMoveY = function(ev){

    var y = parseInt(ev.deltaY)+parseInt(this.y);

    var translate = 'translate(0, ' + y + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};
HammerScroll.prototype.onPanEndY = function(ev){

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

// this.body = this.$dom[0];
//
// this.hammer = new Hammer.Manager(this.body);
//
// this.direction = Hammer.DIRECTION_HORIZONTAL;
// this.panes = this.body.getElementsByClassName("_box")[0];
// this.length = this.panes.children.length;
// if (pa.group) this.length = Math.ceil(this.length / pa.group);
//
// this.width = pa.width;
// this.index = 0;
//
// this.panes.style.width = (this.length*pa.width+100)+"px";
//
// this.$page_now = false;
// if(pa.page){
//     this.$page_now = $(pa.page.now);
//     this.$page_max = $(pa.page.max);
//     if(this.$page_now.length) this.$page_now.html('1');
//     if(this.$page_max.length) this.$page_max.html(this.length);
// }
//
// this.$point = false;
// if(pa.point){
//     this.$point = $(pa.point);
//     if(this.$point.length){
//         var point_html = "<ul>";
//         for(var i=0; i<this.length; i++){
//             point_html+= '<li></li>';
//         }
//         point_html+= "</ul>";
//         this.$point.html(point_html);
//         this.$point.find("li:first").addClass("act");
//     }
// }
//
// this.onPan = function (ev) {
//     //拖过的方向确定返回deltaX / deltaY
//     var delta = ev.deltaX;
//     //这是移动的一个比例
//     var percent = (100 / this.width) * delta;
//     var animate = false;
//
//     //放开鼠标后,把animate设置成true，让层自动靠边
//     if (ev.type == 'panend' || ev.type == 'pancancel') {
//         if (Math.abs(percent) > 2 && ev.type == 'panend') {
//             this.index += (percent < 0) ? 1 : -1;
//         }
//         percent = 0;
//         animate = true;
//     }
//
//     this.onShow(this.index, percent, animate);
// };
//
// this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
// this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));
// this.onShow(this.index);

//主体框显示及动画
// HammerSlider.prototype.onShow = function(showIndex, percent, animate){
//     showIndex = Math.max(0, Math.min(showIndex, this.length - 1));
//     percent = percent || 0;
//
//     var className = this.body.className;
//
//     if(animate) {
//         if(className.indexOf('animate') === -1) {
//             this.body.className += ' animate';
//         }
//     } else {
//         if(className.indexOf('animate') !== -1) {
//             this.body.className = className.replace('animate', '').trim();
//         }
//     }
//
//     var pos, translate;
//     pos = (this.width / 100) * ((-showIndex * 100) + percent);
//     translate = 'translate3d(' + pos + 'px, 0, 0)';
//     this.panes.style.webkitTransform = translate;
//
//     this.index = showIndex;
//
//     if(this.$page_now) this.$page_now.html(showIndex+1);
//     if(this.$point) {
//         this.$point.find("li").removeClass("act");
//         this.$point.find("li:eq("+showIndex+")").addClass("act");
//     }
//
// };
//
// HammerSlider.prototype.onPre = function(){
//     var percent = 0;
//     if(this.index == 0){
//         percent = 13;
//
//         var _this = this;
//         setTimeout(function(){
//             _this.onShow(_this.index, 0, true);
//         }, 500)
//     }
//     this.onShow(this.index-1, percent, true);
// };
//
// HammerSlider.prototype.onNext = function(){
//     var percent = 0;
//     if(this.index == this.length-1){
//         percent = -13;
//
//         var _this = this;
//         setTimeout(function(){
//             _this.onShow(_this.index, 0, true);
//         }, 500)
//     }
//     this.onShow(this.index+1, percent, true);
// };
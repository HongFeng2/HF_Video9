function HammerPhoto(bid, id) {

    this.id = id;
    this.$img = $(this.id);

    this.$box  = $(bid);
    this.box = this.$box[0];
    this.bw = this.$box.width();
    this.bh = this.$box.height();

    //建立$hammer类
    this.hammer = new Hammer.Manager(this.box);
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 }));
    this.hammer.on("panstart", Hammer.bindFn(this.onPanStart, this));
    this.hammer.on("panmove", Hammer.bindFn(this.onPanMove, this));
    this.hammer.on("panend", Hammer.bindFn(this.onPanEnd, this));

}
HammerPhoto.prototype.onPanStart = function(ev){

    this.iw = this.$img.width();
    this.ih = this.$img.height();
    this.mtop = this.bh-this.ih;
    this.mleft = this.bw-this.iw;

};
HammerPhoto.prototype.onPanMove = function(ev){

    var t = 10;
    var x = ev.deltaX/t;
    var y = ev.deltaY/t;

    var top = parseInt(this.$img.css("margin-top").replace("px", ""));
    var left = parseInt(this.$img.css("margin-left").replace("px", ""));

    var mx = left+x;
    var my = top+y;
    if(mx>0) mx=0;
    if(my>0) my=0;
    if(mx<this.mleft) mx=this.mleft;
    if(my<this.mtop) my=this.mtop;

    this.$img.css({"margin-top":my, "margin-left":mx});

};
HammerPhoto.prototype.onPanEnd = function(ev){

};
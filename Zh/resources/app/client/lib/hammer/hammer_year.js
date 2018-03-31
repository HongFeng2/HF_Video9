function HammerYear(id, mid, h, p) {

    this.id = id;
    this.$dom = $(id);
    this._this = {};
    this.$menu = $(mid);


    this.hammer = new Hammer.Manager(this.$dom[0]);
    let c = this.$dom.html();
    this.$dom.html("<div class='HammerYear_Box'>"+c+"</div>").css({"overflow":"hidden"});
    this.$box = this.$dom.find(".HammerYear_Box");

    this._this.$box = this.$box;
    this._this.$menu = this.$menu;

    this._this.now = 0;
    this._this.h = h;
    this._this.p = p-1;

    this.hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold: 10 }));
    //this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 }));
    this.hammer.on("swipeup", Hammer.bindFn(this.onSwipeUp, this._this));
    this.hammer.on("swipedown", Hammer.bindFn(this.onSwipeDown, this._this));


}

HammerYear.prototype.onSwipeUp = function(){

    this.now++;
    if(this.now>this.p) this.now = this.p;

    let y = -parseInt(this.h * this.now);

    this.$box.velocity("stop").velocity({ translateY: y }, 300);

    this.$menu.find(".HammerYearMenu").removeClass("act");
    this.$menu.find(".HammerYearMenuId"+this.now).addClass("act");

};
HammerYear.prototype.onSwipeDown = function(){
    this.now--;
    if(this.now<0) this.now = 0;

    let y = -parseInt(this.h * this.now);

    this.$box.velocity("stop").velocity({ translateY: y }, 300);

    this.$menu.find(".HammerYearMenu").removeClass("act");
    this.$menu.find(".HammerYearMenuId"+this.now).addClass("act");
};

HammerYear.prototype.top = function(){
    let go = this._this.now;
    this._this.now = 0;

    let y = -parseInt(this._this.h * this._this.now);

    let time = (parseInt(go)+1)*200;

    this._this.$box.velocity("stop").velocity({ translateY: y }, time);

    this._this.$menu.find(".HammerYearMenu").removeClass("act");
    this._this.$menu.find(".HammerYearMenuId0").addClass("act");
};

HammerYear.prototype.go = function(mid){

    let go = Math.abs(this._this.now-mid);
    this._this.now = mid;

    let y = -parseInt(this._this.h * this._this.now);

    let time = (parseInt(go)+1)*200;
    this._this.$box.velocity("stop").velocity({ translateY: y }, time);

    this._this.$menu.find(".HammerYearMenu").removeClass("act");
    this._this.$menu.find(".HammerYearMenuId"+mid).addClass("act");
};

HammerYear.prototype.reset = function(){
    this._this.now = 0;
    this._this.$box.velocity({ translateY: 0 }, 0);
    this._this.$menu.find(".HammerYearMenu").removeClass("act");
    this._this.$menu.find(".HammerYearMenuId0").addClass("act");
};
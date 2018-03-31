function HammerHand(id, pa) {


    this.$dom  = $(id);
    this.body = this.$dom[0];
    this.pa = pa;

    //建立$hammer类
    this.hammer = new Hammer.Manager(this.body);
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 10 }));
    this.hammer.on("panend", Hammer.bindFn(this.onPanEnd, this.pa));

}
HammerHand.prototype.onPanEnd = function(ev){


    if(ev.deltaY<0) {
        if(this.up) this.up();
    }else{
        if(this.down) this.down();
    }

};
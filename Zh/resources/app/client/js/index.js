Room.Loader = {};
Room.Loader.ppt = ()=>{
    let Start = "Index";
    cc.ppt(["Loader", Start] , (after)=>{
        cc.m["Loader"].velocity({ opacity: 0 }, { duration: 1000, display:"none"} );
        cc.m[Start].show().velocity({ opacity: [1,0] }, 1000);
        setTimeout(Room.Index.ppt, 6000)
    })
};

// Index
Room.Index = {};
Room.Index.dom = ()=>{

    $$("#Index").click(function(){
        Room.Index.ppt();
    });

    $$("#Video").click(function(){
        Room.Index.back();
    });

    ws.on("reload", function(){
        location.reload();
    });

    Room.Index.video_io();
};

Room.Index.video_io = ()=>{

    Dom.Video = new Media("#Video video");
    Dom.Video.loop(true);
    Dom.VideoCtrl = zh.conf.to;

    // if(Dom.Video.ifLoop){
    //     Dom.Video.loopEnd(function(i){
    //         ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaLoop", val:i});
    //     });
    // }else{
    //     Dom.Video.end(function(v){
    //         Room.Index.back();
    //         ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaEnd"});
    //     });
    // }

    if(Dom.Video.ifLoop){
        Dom.Video.end(function(v){

            Room.Index.back();
            ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaEnd"});
        });
    }else{
        Dom.Video.end(function(v){
            Room.Index.back();
            ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaEnd"});
        });
    }



    ws.on("MediaStop", function(json){
        Dom.Video.stop();
    });

    ws.on("MediaPlay", function(json){
        if(json.val) Dom.Video.volume(json.val);
        if(json.time || json.time===0) Dom.Video.time(json.time);
        if(cc.id!="Video") Room.Index.ppt();
        Dom.Video.play();
    });

    ws.on("MediaEnd", function(json){
        Room.Index.back();
    }.bind(this));

    ws.on("MediaTime", function(json){
        if(json) Dom.Video.time(json.val);
    }.bind(this));

    ws.on("MediaLength", function(json){
        ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaLength", val:Dom.Video.len()})
    });

    ws.on("MediaVol", function(json){
        console.log("声音调节", json.val);
        if(json) Dom.Video.volume(json.val);
    });

    ws.on("H_Loop", function(json){
        Dom.Video.unbind();
        console.log("循环播放", json.val);
        if(json.val=="no"){
            Dom.Video.loop(false);
            Dom.Video.end(function(v){
                ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaEnd"});
                Room.Index.back();
            });
        }else{
            Dom.Video.loop(true);
            Dom.Video.loopEnd(function(i){
                ws.emit({to:"Guide", key:Dom.VideoCtrl+"MediaLoop", val:i});
            });
        }
    });

    // Dom.H_GY = 1;
    // ws.on("H_GY", function(json){
    //     console.log("感应器开关", json.val);
    //     if(json.val=="no"){
    //         Dom.H_GY = 0;
    //     }else{
    //         Dom.H_GY = 1;
    //     }
    // });


    // io.on("io_bx01", function(){
    //     if(Dom.H_GY){
    //         if(cc.id!="Video") Room.Index.ppt();
    //         Dom.Video.play();
    //     }
    // });

    io.on("io_bx01", function(){
        if(cc.id!="Video"){
            if(Time.video) clearTimeout(Time.video);
            Room.Index.ppt();
        }
    });



};

Room.Index.ppt = ()=>{
    Dom.Video.play(0);
    Dom._unable.show();
    cc.ppt([cc.id, "Video"] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 200, display:"none"});
        cc.m["Video"].show().velocity({ opacity: [1,0] }, 200, ()=>{
            Dom._unable.hide();
            //after.come();
        });
    });
};

Room.Index.back = ()=>{

    if(Time.video) clearTimeout(Time.video);
    if(Dom.Video.ifLoop){
        Time.video = setTimeout(function(){
            Room.Index.ppt();
        } , 60000);
    }

    Dom._unable.show();
    cc.ppt([cc.id, "Index"] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 200, display:"none"});
        cc.m["Index"].show().velocity({ opacity: [1,0] }, 200, ()=>{
            Dom.Video.stop(0);
            Dom._unable.hide();
            //after.come();
        });
    });
};
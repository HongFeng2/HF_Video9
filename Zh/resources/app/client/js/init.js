var init = {};

init.loader = ()=>{
    Dom._unable = $("#_unable");

    ws = new ws_client(zh.conf.iocenter, {id:zh.conf.id});
    ws.connect( function(){
        setTimeout(function(){
            zh.ini();
            zh.do();
            setTimeout(Room.Loader.ppt , 500);
        },300);
    });


};
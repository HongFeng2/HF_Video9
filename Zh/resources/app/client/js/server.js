var Progress = function(num){
    Log("$$$$【Server.loader】目前完成："+num+"%");
    if(num==100) num=99;
    $$("#Loader .word").html("正在更新资料中，已完成："+num+"%");
};

var Download ={};
Download.down = function(){

    var serv = zh.conf.server+"/uploads/person/";
    var local = Url.fs+"uploads/person/";
    
    for(var i in Base.word){
        var rs = Base.word[i];
        if(rs.photo) Server.save(serv , local, rs.photo, rs.photo_size);
    }

};
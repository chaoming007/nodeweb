/**
 * Created by chencm on 2016/11/25.
 */
(function($){

    var loadBtn=$("#loadBtn"); //加载按钮
    var listBox=$("#listBox"); //列表容器
    var classObj=$("#classObj"); //分类
    var tuff=true;
    var limitNum=1;          //加载一次显示的数量
    var page=0;              //页码数
    var datJson={};

    loadBtn.on("click",function(){
        if(tuff){
            page=page+1;
            datJson.pagenum=limitNum;
            datJson.classCid=classObj.val();
            datJson.page=page;         //页码数
            ajaxDataFun(datJson);
            tuff=false;
        }
    });
    function ajaxDataFun(datJson){
            $.ajax({
                url: '/newlist',
                type: 'POST',
                dataType: 'json',
                data: {
                    pnum:parseInt(datJson.pagenum),   //加载的数量
                    cid:datJson.classCid,
                    page: datJson.page             //页码数
                },
                beforeSend:function(XMLHttpRequest){
                    $(".load-sty").addClass("load-show");
                    $(".load-txt").hide();
                },
                success:function(dat) {
                    console.log(dat);
                    setTimeout(function(){
                            $(".load-sty").removeClass("load-show");
                            $(".load-txt").show();
                            if(dat.state==1){
                                dataDomFun(dat.newdat);
                                if(!dat.moreState){
                                    $("#loadBtn").hide();
                                }
                            }
                    },500);
                }
            })
    }

function dataDomFun(dat){
    var str="";
    $(dat).each(function(i){
        var oLi=$(' <li class="clearfix"><div class="img-box"><a href="/newdetail?id='+dat[i]._id+'"><img src="'+dat[i].newImg+'" alt=""></a></div><div class="txt-box"><div class="h-tit"><h2><a href="/newdetail?id='+dat[i]._id+'">'+dat[i].title+'</a></h2></div><div class="new-intro">'+dat[i].content+'<a href="/newdetail?id='+dat[i]._id+'">[详情]</a></div><div class="msg-box"><span>分类：<a href="#">'+dat[i].newclass.sortname+'</a></span><span>发布者：'+dat[i].author+'</span> <span>发布时间：'+dat[i].time+'</span><span>评论数：'+dat[i].commentnum+'</span><span>阅读量：'+dat[i].looknum+'</span></div></div></li>');
        listBox.append(oLi);
    });
    tuff=true;
}


})(jQuery)
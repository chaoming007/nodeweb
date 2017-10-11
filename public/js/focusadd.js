/**
 * Created by chencm on 2016/11/21.
 */
(function($){
    var imglink="";
    var tuff=true;
    var succBox=$("#succBox");
    var pubBtn=$("#pubBtn");  //路垄虏录掳麓脜楼
    var gxpubBtn=$("#gxpubBtn");  //赂眉脨脗掳麓脜楼
    var gxsuccBox=$("#gxsuccBox");
    var nid=$("#id").val();


    pubBtn.on("click",function(){
        updataFun(0);
    });
    gxpubBtn.on("click",function(){
        updataFun(1);
    });
    //
    /*路垄卤铆禄貌脮脽赂眉脨脗*/
    function updataFun(x){
        if($("#title").val()==""){
            alert("脥录脝卢卤锚脤芒虏禄脛脺脦陋驴脮");
            return false;
        }
        if(tuff){
            tuff=false;
            if(x==0){
                pubBtn.hide();
                succBox.show();
            }
            if(x==1){
                gxpubBtn.hide();
                gxsuccBox.show();
            }
            dataFun(x);
        }
    }
    function  dataFun(x){
        var url="";
        var data={
            title:$("#title").val(),
            link:$("#link").val(),
            show:$("#show").val()
        };
        if(x==1){
            data.id=nid;
            url="/admin/focuslist/focusupdata";
        }else{
            data.id="";
            url="/admin/focuslist/focusadd";
        }
        data.imglink=$("#imgLookSrc").val()?$("#imgLookSrc").val():imglink;
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'JSON',
            data: data
        }).done(function(data) {
            if(data.status==1){
                tuff=true;
                setTimeout(function(){
                    window.location.href="/admin/focuslist";
                },300);
            }
        });
    }

/*脥录脝卢脡脧麓芦*/

    imgUpLoadFun();
    function imgUpLoadFun(){
        var imgLoadForm=$("#imgLoadForm");
        var imgFile=$("#imgFile");
        var upImgBtn=$("#upImgBtn");
        var imgLook=$("#imgLook");
        upImgBtn.on("click",function(){
            if(imgFile.val()==""){
                alert("脛茫禄鹿脙禄脫脨脩隆脭帽脥录脝卢");
                return;
            }
            var data=new FormData($("#imgLoadForm")[0]);
            $.ajax({
                url: '/imgLoad',
                type: 'POST',
                cache: false,
                contentType: false, //虏禄驴脡脠卤虏脦脢媒
                processData: false, //虏禄驴脡脠卤虏脦脢媒
                data: data
            }).done(function(data) {
                if(data.error==0){
                    var img="<img src='"+data.url+"' alt=''>";
                    imglink=data.url;
                    imgLook.html(img);
                }
            });

        });
    }









})(jQuery)
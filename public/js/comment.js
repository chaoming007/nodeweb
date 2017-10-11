(function ($) {
   
var commentTxt=$("#commentTxt");  //评论输入框
var commentBtn=$("#commentBtn");  //评论按钮
var commentList=$("#commentList");//评论列表
var tuff=true;

/*获取时间*/

function  getTimeFun(){
    var tim=new Date();
    var tims=tim.getFullYear()+"-"+setNum((parseInt(tim.getMonth())+1))+"-"+setNum(tim.getDate())+" "+setNum(tim.getHours())+":"+setNum(tim.getMinutes())+":"+setNum(tim.getSeconds());
    return tims;
    function setNum(num){
        var s=num;
        if(String(num).length<=1){
            s="0"+num;
        }
        return s;
    }
}


//setCommentSty()
//function setCommentSty(){
//    commentTxt.on("focus",function(){
//        $(this).removeClass("inp-wrap");
//    });
//}

//*主回复*/

commentBtn.on("click",function(){
    var val=$.trim(commentTxt.val());
    var userId=$("#userId").val();
    var newId=$("#newId").val();
    var commentusername=$("#commentusername").val();
    var tims=getTimeFun();
    if(val=="" || val.length<5 ){
        alert("评论内容不能为空，并且不能少于5个字！");
        return;
    }
    if(tuff){
        var dat={
            commenttxt:val,
            userId:userId,
            newId:newId,
            tim:tims,
            username:commentusername
        };
         tuff=false;
         commentSubFun(dat);
    }
});

function commentSubFun(dat){
    var dataJson=dat;
    $.ajax({
        url: '/comment',
        type: 'POST',
        dataType: 'JSON',
        data:dataJson
    }).done(function(date) {
        if(date){
             tuff=true;
             if(date.state==0){
                 alert("请先登录在发表评论！")
                 return;
             }
             if(date.mid==1){
                $("#subSuccessObj").show();
                setTimeout(function(){
                    $("#subSuccessObj").hide();
                },700);
             }
             if(date.state==1){
                createCommentFun(date);
                commentTxt.val("");
             }
        }
    })
   
}

function createCommentFun(dat){
        var str="";
        commentList.html("");
       dat.dat.forEach(function(item,ind){
            str+='<div class="comment-row"><input type="hidden" value="'+item._id+' name="commentId" class="commentIdSty" ><span class="user-img"><a href="#"><img src="../public/images/1.jpg" alt="" ></a></span><div class="user-txt"><p class="p-msg"><span class="name"><a href="#">'+item.user.username+'</a></span><span class="time">'+item.date+'</span></p><div class="content-txt">'+item.content+'</div><div class="info-box"><a href="javascript:;" class="replyBtn"><input type="hidden" name="mainCommendId" class="mainCommendId" value="'+item._id+'"><input type="hidden" name="userId" class="userId" value="'+item.user._id+'"><input type="hidden" name="fusername" class="fusername" value="'+item.user.username+'"><input type="hidden" name="formId" class="formId" value="'+dat.reponseJson+'"><input type="hidden" name="newCommentId" class="newCommentId" value="'+item.news+'">回复</a></div><!-- 子回复框 start  --><div class="child-comment-box"></div><!-- 子回复框 end --><!-- 回复 start  -->'

                item.reply.forEach(function(itm,i){
                     str+='<div class="qt-commtent"><p class="p-msg"><span class="name"><em><a href="#">'+itm.from.username+'</a></em> &nbsp;&nbsp;回复&nbsp;&nbsp;<em><a href="#">'+itm.to.username+'</a></em></span><span class="time">'+itm.tim+'</span></p><div class="content-txt">'+itm.content+'</div><div class="info-box"><a href="javascript:;" class="zreplyBtn"><input type="hidden" name="mainCommendId" class="mainCommendId" value="'+item._id+'"><input type="hidden" name="userId" class="userId" value="'+itm.from._id+'"><input type="hidden" name="fusername" class="fusername" value="'+itm.from.username+'"><input type="hidden" name="formId" class="formId" value="'+dat.reponseJson+'"><input type="hidden"name="newCommentId" class="newCommentId" value="'+item.news+'">回复</a></div></div>';
                })
                 str+='<!-- 回复 end  --></div></div>';
       });
       str=$(str);
       commentList.prepend(str);
       replyFun();
}

/*子回复*/

replyFun();
function  replyFun(){
        /*子回复*/
         $(".zreplyBtn").each(function(ind){
            $(this).on("click",function(){
                var obj=$(".qt-commtent");
                addHftextInp($(this),obj,ind);
            });
        });

        /*回复*/
        $(".replyBtn").each(function(ind){
            $(this).on("click",function(){
                var obj=$(".child-comment-box");
                addHftextInp($(this),obj,ind);
            });
        });

        /*添加回复输入框*/
       function addHftextInp(ths,inpWarpBox,ind){
           var cval=$("#commentTxt_c").val();
           var  str='<div class="hf-box" id="hfBox_c"><textarea class="inp-box inp-w" id="commentTxt_c" placeholder="请输入回复内容"></textarea><div class="inp-btn"><a href="javascript:;" class="btn btn-success add-img-btn commentBtn-c" id="commentBtn_c">马上回复</a></div></div>';
           var u=ths.find(".fusername").val();   //要回复的用户名
           $("#hfBox_c").remove();
           inpWarpBox.eq(ind).append(str);
           $("#commentTxt_c").attr("placeholder","正在回复用户："+u+"的评论~~");
           bindClinkFun(ths);
       }
        //绑定递交回复事件函数
        function  bindClinkFun(t){
            $(".comment-row").find(".commentBtn-c").on("click",function(){
                 var replyDat={
                        rcontent:$.trim($("#commentTxt_c").val()),   //回复内容
                        mainCommentId:t.find(".mainCommendId").val(),//主评论id
                        from:t.find(".formId").val(),
                        to:t.find(".userId").val(),
                        newCommentId:t.find(".newCommentId").val(),  //新闻id
                        hftim:getTimeFun()
                   };
                if(replyDat.rcontent==""||replyDat.rcontent.length<5){
                    alert("回复内容不能为空，并且不能少于5个字！");
                    return;
                }
                replyAjaxFun(replyDat);
            });
        }
}

function  replyAjaxFun(replyDat){
    commentSubFun(replyDat);
}





})(jQuery);
!function(n){function e(){function n(n){var e=n;return String(n).length<=1&&(e="0"+n),e}var e=new Date,t=e.getFullYear()+"-"+n(parseInt(e.getMonth())+1)+"-"+n(e.getDate())+" "+n(e.getHours())+":"+n(e.getMinutes())+":"+n(e.getSeconds());return t}function t(e){var t=e;n.ajax({url:"/comment",type:"POST",dataType:"JSON",data:t}).done(function(e){if(e){if(o=!0,0==e.state)return void alert("请先登录在发表评论！");1==e.mid&&(n("#subSuccessObj").show(),setTimeout(function(){n("#subSuccessObj").hide()},700)),1==e.state&&(a(e),i.val(""))}})}function a(e){var t="";d.html(""),e.dat.forEach(function(n,a){t+='<div class="comment-row"><input type="hidden" value="'+n._id+' name="commentId" class="commentIdSty" ><span class="user-img"><a href="#"><img src="../public/images/1.jpg" alt="" ></a></span><div class="user-txt"><p class="p-msg"><span class="name"><a href="#">'+n.user.username+'</a></span><span class="time">'+n.date+'</span></p><div class="content-txt">'+n.content+'</div><div class="info-box"><a href="javascript:;" class="replyBtn"><input type="hidden" name="mainCommendId" class="mainCommendId" value="'+n._id+'"><input type="hidden" name="userId" class="userId" value="'+n.user._id+'"><input type="hidden" name="fusername" class="fusername" value="'+n.user.username+'"><input type="hidden" name="formId" class="formId" value="'+e.reponseJson+'"><input type="hidden" name="newCommentId" class="newCommentId" value="'+n.news+'">回复</a></div><!-- 子回复框 start  --><div class="child-comment-box"></div><!-- 子回复框 end --><!-- 回复 start  -->',n.reply.forEach(function(a,s){t+='<div class="qt-commtent"><p class="p-msg"><span class="name"><em><a href="#">'+a.from.username+'</a></em> &nbsp;&nbsp;回复&nbsp;&nbsp;<em><a href="#">'+a.to.username+'</a></em></span><span class="time">'+a.tim+'</span></p><div class="content-txt">'+a.content+'</div><div class="info-box"><a href="javascript:;" class="zreplyBtn"><input type="hidden" name="mainCommendId" class="mainCommendId" value="'+n._id+'"><input type="hidden" name="userId" class="userId" value="'+a.from._id+'"><input type="hidden" name="fusername" class="fusername" value="'+a.from.username+'"><input type="hidden" name="formId" class="formId" value="'+e.reponseJson+'"><input type="hidden"name="newCommentId" class="newCommentId" value="'+n.news+'">回复</a></div></div>'}),t+="<!-- 回复 end  --></div></div>"}),t=n(t),d.prepend(t),s()}function s(){function t(e,t,s){var m=(n("#commentTxt_c").val(),'<div class="hf-box" id="hfBox_c"><textarea class="inp-box inp-w" id="commentTxt_c" placeholder="请输入回复内容"></textarea><div class="inp-btn"><a href="javascript:;" class="btn btn-success add-img-btn commentBtn-c" id="commentBtn_c">马上回复</a></div></div>'),i=e.find(".fusername").val();n("#hfBox_c").remove(),t.eq(s).append(m),n("#commentTxt_c").attr("placeholder","正在回复用户："+i+"的评论~~"),a(e)}function a(t){n(".comment-row").find(".commentBtn-c").on("click",function(){var a={rcontent:n.trim(n("#commentTxt_c").val()),mainCommentId:t.find(".mainCommendId").val(),from:t.find(".formId").val(),to:t.find(".userId").val(),newCommentId:t.find(".newCommentId").val(),hftim:e()};return""==a.rcontent||a.rcontent.length<5?void alert("回复内容不能为空，并且不能少于5个字！"):void m(a)})}n(".zreplyBtn").each(function(e){n(this).on("click",function(){var a=n(".qt-commtent");t(n(this),a,e)})}),n(".replyBtn").each(function(e){n(this).on("click",function(){var a=n(".child-comment-box");t(n(this),a,e)})})}function m(n){t(n)}var i=n("#commentTxt"),c=n("#commentBtn"),d=n("#commentList"),o=!0;c.on("click",function(){var a=n.trim(i.val()),s=n("#userId").val(),m=n("#newId").val(),c=n("#commentusername").val(),d=e();if(""==a||a.length<5)return void alert("评论内容不能为空，并且不能少于5个字！");if(o){var r={commenttxt:a,userId:s,newId:m,tim:d,username:c};o=!1,t(r)}}),s()}(jQuery);
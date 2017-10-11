/**
 * Created by chencm on 2016/11/1.
 */
(function($){
    var win_h=$(window).height();
    var win_w=$(window).width();
    var doc_h=$(document).height();
    var loginLink=$("#loginLink");
    var maskObj=$("#maskObj");                //弹出层容器
    var closeBtn=maskObj.find(".close-btn"); //关闭按钮
    var loginBtn=$("#loginBtn");            //登陆按钮
    var infoBox=$("#info");                 //信息提示
    maskObj.height(doc_h).width(win_w);
    maskObj.find(".mask-bg").height(doc_h).width(win_w);

    loginLink.on('click', function(event) {
    	 event.preventDefault;
    	 maskObj.fadeIn(300);
    });

    closeBtn.on("click",function(event){
    	 event.preventDefault;
    	  maskObj.fadeOut(300);
    });

    /*
     *    登陆增加ajax事件
     * 
     */
      loginBtn.on("click",function(){
      	        var inpJson={};
      	        var tuff=false;
      			var username=$("#username").val();
      			var password=$("#password").val();
      			if(username==""){
      				 infoBox.addClass("warning");
      				 infoBox.html("用户名不能为空");
      				 return;
      			}
      			if(password==""){
      				 infoBox.addClass("warning");
      				 infoBox.html("密码不能为空");
      				 return;
      			}
      			tuff=true;
      			inpJson.username=username;
      			inpJson.password=password;
      			inpJson.tuff=tuff;
      			fAjaxLogin(inpJson);
      			
      });

      $("#logLinkBox").find(".quitLink").on("click",function(){
      	  fAjaxQuit();

	    });

      /*退出的ajax函数*/
      function fAjaxQuit(){
      		$.ajax({
      			url: '/clear',
      			type: 'POST',
      			dataType: 'JSON',
      			data: {quitVal: 'clear'},
      		})
      		.done(function(data) {
      			if(data.num==1){
      				 window.location.reload();
      			}
      		})
      	
      }

      /* 登陆的ajax函数*/
      function fAjaxLogin(inpJson){

      	  if(inpJson){
      	  			$.ajax({
      	  				url: '/login',
      	  				type: 'POST',
      	  				dataType: 'Json',
      	  				data: {
      	  					username:inpJson.username,
      	  					password:inpJson.password
      	  				},
      	  			}).done(function(data) {
      	  				  if(data.stateNum==3){
      	  				  	   infoBox.addClass("warning");
            					   infoBox.html("账号或密码错误");
            					   return;
      	  				  }
      	  				  if(data.stateNum==0){    //登陆成功
      	  				  		maskObj.fadeOut(300);
      	  				  		loginLink.hide();
      	  				  		$("#logLinkBox").find(".userNameBox").html(data.userinfo.username);
      	  				  		$("#logLinkBox").show();
      	  				  		 window.location.reload();
      	  				  }
      	  			}).fail(function() {
      	  				console.log("登陆失败");
      	  			})
      	  }

      }




})(jQuery)
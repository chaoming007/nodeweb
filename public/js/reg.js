/**
 * Created by chencm on 2016/11/1.
 */
(function($){
    var win_h=$(window).height();
    var win_w=$(window).width();
    var doc_h=$(document).height();
    var loginLink=$("#loginLink");
	var logIdObj=$("#logId");    //登录框
	var regIdObj=$("#regId");    //注册框
    var maskObj=$("#maskObj");                //弹出层容器
    var closeBtn=maskObj.find(".close-btn"); //关闭按钮
    var loginBtn=$("#loginBtn");            //登陆按钮
    var infoBox=$("#info");                 //登录信息提示
    var reginfo=$("#reginfo");              //注册信息提示
    maskObj.height(doc_h).width(win_w);
    maskObj.find(".mask-bg").height(doc_h).width(win_w);

    loginLink.on('click', function(event) {
    	 event.preventDefault;
    	 maskObj.fadeIn(300);
    });
	$("a[data-log='log']").on('click', function(event) {
		event.preventDefault;
		maskObj.fadeIn(300);
	});


    closeBtn.on("click",function(event){
    	 event.preventDefault;
    	  maskObj.fadeOut(300);
    });

	$("#regLink").on("click",function(){
		  logIdObj.hide();
		  regIdObj.show();

		 reginfo.removeClass("warning");
		 reginfo.html("请输入注册的用户名和密码");
		 $("#regusername").val("");
		 $("#regpassword").val("");
		 $("#vregpassword").val("");

	});
	$("#logLink").on("click",function(){
		  logIdObj.show();
		  regIdObj.hide();

		  infoBox.removeClass("warning");
		  infoBox.html("请输入正确的账号密码");
		  $("#username").val("");
		  $("#password").val("");
	});

    /*
    *  注册事件函数
    * */
    $("#regBtn").on("click",function(){
            var regJson={};
            var regusername=$("#regusername").val();     //注册用户名
            var regpassword=$("#regpassword").val();     //注册密码
            var vregpassword=$("#vregpassword").val();   //重复密码
            if(regusername==""){
                reginfo.addClass("warning");
                reginfo.html("用户名不能为空");
                return;
            }
            if(regpassword==""){
                reginfo.addClass("warning");
                reginfo.html("密码不能为空");
                return;
            }
            if(regpassword!==vregpassword){
                reginfo.addClass("warning");
                reginfo.html("两次输入的密码不一致");
                return;
            }

           /*ajax*/
            $.ajax({
                url: '/register/reg',
                type: 'POST',
                dataType: 'JSON',
                data: {
					regusername:regusername,
					regpassword:regpassword,
					vregpassword:vregpassword
				}
            }).done(function(data) {
                if(data.statusNum==0){
					logIdObj.show();
					regIdObj.hide();
					infoBox.removeClass("warning");
					infoBox.html("请输入正确的账号密码");
					$("#username").val("");
					$("#password").val("");
					return;
                }
				if(data.statusNum==4){
					reginfo.addClass("warning");
					reginfo.html("用户名已经存在");
					return;
				}
            })

    });



    /*
     *  登陆事件函数
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
      			url: '/register/clear',
      			type: 'POST',
      			dataType: 'JSON',
      			data: {quitVal: 'clear'}
      		}).done(function(data) {
      			if(data.num==1){
      				 window.location.reload();
      			}
      		})
      }

      /* 登陆的ajax函数*/
      function fAjaxLogin(inpJson){
      	  if(inpJson){
	  			$.ajax({
	  				url: '/register/login',
	  				type: 'POST',
	  				dataType: 'Json',
	  				data: {
	  					username:inpJson.username,
	  					password:inpJson.password
	  				}
	  			}).done(function(data) {
	  				  if(data.stateNum==3){
	  				  	   infoBox.addClass("warning");
      					   infoBox.html("账号或密码错误");
      					   return;
	  				  }
					  if(data.stateNum==4){
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
	  			})
	  			.fail(function() {
	  				console.log("登陆失败");
	  			})
      	  }

      }

















})(jQuery)
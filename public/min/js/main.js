!function(n){function o(){n.ajax({url:"/clear",type:"POST",dataType:"JSON",data:{quitVal:"clear"}}).done(function(n){1==n.num&&window.location.reload()})}function i(o){o&&n.ajax({url:"/login",type:"POST",dataType:"Json",data:{username:o.username,password:o.password}}).done(function(o){return 3==o.stateNum?(r.addClass("warning"),void r.html("账号或密码错误")):void(0==o.stateNum&&(d.fadeOut(300),e.hide(),n("#logLinkBox").find(".userNameBox").html(o.userinfo.username),n("#logLinkBox").show(),window.location.reload()))}).fail(function(){console.log("登陆失败")})}var a=(n(window).height(),n(window).width()),t=n(document).height(),e=n("#loginLink"),d=n("#maskObj"),l=d.find(".close-btn"),u=n("#loginBtn"),r=n("#info");d.height(t).width(a),d.find(".mask-bg").height(t).width(a),e.on("click",function(n){n.preventDefault,d.fadeIn(300)}),l.on("click",function(n){n.preventDefault,d.fadeOut(300)}),u.on("click",function(){var o={},a=!1,t=n("#username").val(),e=n("#password").val();return""==t?(r.addClass("warning"),void r.html("用户名不能为空")):""==e?(r.addClass("warning"),void r.html("密码不能为空")):(a=!0,o.username=t,o.password=e,o.tuff=a,void i(o))}),n("#logLinkBox").find(".quitLink").on("click",function(){o()})}(jQuery);
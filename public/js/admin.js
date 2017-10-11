/**
 * Created by chencm on 2016/11/2.
 */
(function($){
    var subBtn=$("#subBtn");//修改提交按钮
    var succBox=$("#succBox");//成功提示按钮
    var delBtn=$("#delBtn");  //删除提交按钮
    var addBtn=$("#addBtn");   //添加用户按钮
    var addUserBox=$("#addUserBox"); //添加用户容器
    var sortSubBtn=$("#sortSubBtn"); //分类提交按钮

    subBtn.on("click",function(){
        $(this).hide();
        succBox.show();
    });
    delBtn.on("click",function(){
        $(this).hide();
        succBox.show();
    });



    $("#formBox").on("submit",function(){
        if(userTestFun()){
            return false;
        }
        addBtn.hide();
        succBox.show();
    });

    function testUsername(){
            var tuff=true;
            $.ajax({
                url: '/admin/useradd',
                type: 'POST',
                dataType: 'json',
                async:false,
                data: {dataval: addUserBox.find(".u").val()},
            }).done(function(dat) {
                  tuff=(dat.val==1)?true:false;
            });
            return tuff;
    }

    /*添加用户验证*/

    function userTestFun(){
          var u=addUserBox.find(".u");
          var p=addUserBox.find(".p");
          var vp=addUserBox.find(".vp");
          var info="";
          $(".t-ts").html("");
          if(u.val()==""){
             info="用户名不能为空";
             tsMsgFun("usernamets",info);
             return true;
          }
         
          if(testUsername()){
             info="用户名已经存在";
             tsMsgFun("usernamets",info);
             return true;
          }
          if(p.val()==""){
            info="密码不能为空";
            tsMsgFun("passwordts",info);
            return true;
          }
          if(vp.val()!=p.val()){
            info="前后密码输入不一致";
             tsMsgFun("vpasswordts",info);
            return true;
          }

          function  tsMsgFun(boxId,msg){
                $("#"+boxId).html(msg);
          }

    }



    /*分类编辑表单*/
     $("#sortForm").on("submit",function(){
        if(sortTestFun()){
            return false;
        }
        $("#sortSubBtn").hide();
        succBox.show();
    });

     function sortTestFun(){
          var sortname=$("#sortname");
          var sortleve=$("#sortleve");
          var sortts=$("#sortts");
          sortts.html("");
          if(sortname.val()==""){
              sortts.html("分类名不能为空");
              return true;
          }
          if(testSortName()){
               sortts.html("分类已经存在");
               return true;
          }
          return false;

          function  testSortName(){
                var tuff=true;
                 $.ajax({
                    url: '/admin/sortedit',
                    type: 'POST',
                    dataType: 'json',
                    async:false,
                    data: {dataval: sortname.val(),dataid:$("#sortid").val()},
                }).done(function(dat) {
                      tuff=(dat.val==1)?true:false;
                });
                return tuff;
          }
     }

     /*分类的删除*/

     $("#sortListBox").on("submit",function(){
           var num=0;
           $("[name='sort']").each(function(ind){
               if($(this).prop("checked")){
                  num+=1;
               }
           });
          if(num==0){
              alert("你没有选择要删除的分类");
              return false;
          }      
     });

     /*分类的添加*/

      $("#sortAddForm").on("submit",function(){
        if(sortAddFun()){
            return false;
        }
        $("#sortAdd").hide();
        succBox.show();
      });

       function sortAddFun(){
          var sortname=$("#sortname");
          var sortleve=$("#sortleve");
          var sortts=$("#sortts");
          sortts.html("");
          if(sortname.val()==""){
              sortts.html("分类名不能为空");
              return true;
          }
          if(testSortName()){
               sortts.html("分类已经存在");
               return true;
          }
          return false;

          function  testSortName(){
                var tuff=true;
                 $.ajax({
                    url: '/admin/sortadd',
                    type: 'POST',
                    dataType: 'json',
                    async:false,
                    data: {dataval: sortname.val()},
                }).done(function(dat) {
                      tuff=(dat.val==1)?true:false;
                });
                return tuff;
          }


     }

     /*新闻列表的删除*/

     $("#newListBox").on("submit",function(){
           var num=0;
           $("[name='news']").each(function(ind){
               if($(this).prop("checked")){
                  num+=1;
               }
           });
          if(num==0){
              alert("你没有选择要删除的新闻");
              return false;
          }      
     });

    /*新闻列表等级更新*/


    function updataNew(){
        var jsonVal={};
        var inpArr=$("input[name='showInp']");
        var inpId=$("input[name='showId']");
        var valArr=[];
        var idArr=[];
        inpArr.each(function(ind){
            if($(this).val()!=""){
                valArr.push($(this).val());
                idArr.push(inpId.eq(ind).val());
            }else{
                alert("文章等级不能为空");
                return false;
            }
        });
        jsonVal.valArr=valArr;
        jsonVal.idArr=idArr;
        return jsonVal;
    }

    $("#updataNewVal").on("click",function(){
            var dataval=updataNew();
            $.ajax({
                url: '/admin/newlist/newshow',
                type: 'POST',
                dataType: 'json',
                async:false,
                data: {
                    dId:dataval.idArr,
                    dVal:dataval.valArr
                }
            }).done(function(dat) {
                tuff=(dat.val==1)?true:false;
            });
    });


changePassword();

function changePassword(){
    var password=$("#password");
    var t=true;
   $("#changeLink").click(function(){
       if(t){
           password.show();
           $(this).html("点击取消");
           t=false;
       }else{
           password.hide();
           $(this).html("点击修改");
           t=true;
       }

   });
   
   
   
   $("#initpassword").on("click",function(){
   			
		    $.ajax({
		        url: '/admin/userlist/initpassword',
		        type: 'POST',
		        dataType: 'json',
		        async:false,
		        data: {
		            id:$("#uid").val(),
		        }
		    }).done(function(dat) {
		        if(dat.state==1){
		            alert("初始化成功，请牢记密码："+dat.pw);
		        }
		        return;
		    });

	})
   
}







})(jQuery)
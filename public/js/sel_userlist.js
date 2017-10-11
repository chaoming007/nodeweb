/**
 * Created by chencm on 2016/11/22.
 */
(function($){

    /*关键词标题查找*/
    var searchBtn=$("#search-btn");   //搜索按钮
    var searchWord=$("#search-word"); //关键词

    searchBtn.on("click",function(){
         if($.trim(searchWord.val())==""){
             alert("请输入用户名");
             return;
         }else{
             var keyVal=$.trim(searchWord.val());
             $.ajax({
                 url: '/admin/userlist',
                 type: 'GET',
                 dataType: 'json',
                 data:{key:keyVal}
             }).done(function(dat){});
             var url=encodeURI("/admin/userlist?key=" +keyVal);
             window.location.href = url;
         }
    });


})(jQuery)
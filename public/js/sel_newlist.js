/**
 * Created by chencm on 2016/11/22.
 */
(function($){

    /*改变分类筛选*/
    var selClass=$("#sel-class");
    selClass.on("change",function(){
        var selVal=$(this).find('option:selected').val();
        selectFun(selVal);
    });
    function selectFun(selVal){
        $.ajax({
            url: '/admin/newlist',
            type: 'GET',
            dataType: 'json',
            data:{val:selVal}
        }).done(function(dat){
        });
        window.location.href = "/admin/newlist?val=" + selVal;
    }
    /*关键词标题查找*/
    var searchBtn=$("#search-btn");   //搜索按钮
    var searchWord=$("#search-word"); //关键词

    searchBtn.on("click",function(){
         if($.trim(searchWord.val())==""){
             alert("请输入关键词");
             return;
         }else{
             var keyVal=$.trim(searchWord.val());
             $.ajax({
                 url: '/admin/newlist',
                 type: 'GET',
                 dataType: 'json',
                 data:{key:keyVal}
             }).done(function(dat){
             });
             var url=encodeURI("/admin/newlist?val=1&key=" +keyVal);
             window.location.href = url;
         }
    });


})(jQuery)
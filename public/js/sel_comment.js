/**
 * Created by chencm on 2016/11/22.
 */
(function($){

    /*评论列表的删除*/

    $("#commentListBox").on("submit",function(){
        var num=0;
        $("[name='comments']").each(function(ind){
            if($(this).prop("checked")){
                num+=1;
            }
        });
        if(num==0){
            alert("你没有选择要删除的评论");
            return false;
        }
    });

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
                 url: '/admin/commentlist',
                 type: 'GET',
                 dataType: 'json',
                 data:{key:keyVal}
             }).done(function(dat){
             });
             var url=encodeURI("/admin/commentlist?val=1&key=" +keyVal);
             window.location.href = url;
         }
    });



/*删除新闻下的所有评论*/

delAllComment();

function delAllComment(){

    var delCommend=$("#delCommend");
    var page=$("#pagebox").val();
    var newId=$("#newId").val();

    delCommend.on("click",function(){
         if(newId){
             $.ajax({
                 url: '/admin/commentlist/delcomment',
                 type: 'POST',
                 dataType: 'json',
                 data:{
                     page:page,
                     newId:newId
                 }
             }).done(function(dat){
                  if(dat.state==1){
                      window.location.href="/admin/commentlist";
                  }
             });
         }
    });

}

/*删除单条评论*/

delOneComment();

function delOneComment(){
    var commentList=$(".del-btn");

    commentList.each(function(){
        $(this).on("click",function(){
            var id=$(this).find(".bId").val();
            var nid=$("#newId").val();

            var This=$(this);
            if(id){
                $.ajax({
                    url: '/admin/commentlist/delonecomment',
                    type: 'POST',
                    dataType: 'json',
                    data:{
                        cid:id,
                        nid:nid
                    }
                }).done(function(dat){
                    if(dat.state==1){
                         This.parent().remove();
                    }
                    if(dat.state==2){
                        window.location.href="/admin/commentlist";
                    }
                });
            }

        })
    });



}










})(jQuery)
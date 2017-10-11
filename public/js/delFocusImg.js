/**
 * Created by chencm on 2016/11/21.
 */
(function($){

    /*焦点图的删除*/

    $("#imgListBox").on("submit",function(){
        var num=0;
        $("[name='imgs']").each(function(ind){
            if($(this).prop("checked")){
                num+=1;
            }
        });
        if(num==0){
            alert("你没有选择要删除的条目");
            return false;
        }
    });



})(jQuery)
/**
 * Created by chencm on 2016/11/1.
 */
(function($){
	var pubBtn=$("#pubBtn");
	var succBox=$("#succBox");
	var gxpubBtn=$("#gxpubBtn");
	var gxsuccBox=$("#gxsuccBox");
	var formBox=$("#formBox");
	var nid=$("#id").val();
	var newImgLink="";
	var editor;
	var wordcount=0;
	var tuff=true;
	var t=new Date();
	var time=t.getFullYear()+"-"+(t.getMonth()+parseInt(1))+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
	$("#time").val(time);
	KindEditor.ready(function(K) {
		    editor = K.create('#newcontent',{
				uploadJson: '/uploadImg',
				autoHeightMode : true,
				allowFileManager : true,
				afterCreate : function() {
					this.loadPlugin('autoheight');
				},
				afterChange : function() {
					wordcount=this.count('text');
					K('#num').html(wordcount);
				}
			});
		 //    if(nid!=""){
			// 	editor.html(upcontent.html());
			// }
		pubBtn.on("click",function(){
			updataFun(0);
		});
		gxpubBtn.on("click",function(){
			updataFun(1);
		});

		/*发表或者更新*/
		function updataFun(x){
				if($("#title").val()==""){
					alert("新闻标题不能为空");
					return false;
				}
				if(wordcount<50){
					alert("新闻内容不能少于50个字");
					return false;
				}
				if(tuff){
					tuff=false;
					if(x==0){
						pubBtn.hide();
						succBox.show();
					}
					if(x==1){
						gxpubBtn.hide();
						gxsuccBox.show();
					}
					var editorVal=editor.html();
					newDataFun(editorVal);
				}

		}
		function  newDataFun(editorVal){
			   var url=""
			   var data={
				   title:$("#title").val(),
				   author:$("#author").val(),
				   source:$("#source").val(),
				   time:time,
				   newclass:$('#newclass option:selected').val(),
				   keyword:$("#keyword").val(),
				   newcontent:editorVal,
				   show:$("#newshow").val(),
				   page:$("#page").val()
				   //newImgSrc:newImgLink
			   };
				data.newImgSrc=$("#imgLookSrc").val()?$("#imgLookSrc").val():newImgLink;
			   if(nid){
				   url='/admin/newlist/newedit';
				   data.id=nid;
			   }else{
				   url='/admin/newlist/newadd';
			   }
				$.ajax({
					url: url,
					type: 'POST',
					dataType: 'JSON',
					data: data
				}).done(function(data) {
					if(data.status==1){
						tuff=true;
						setTimeout(function(){
							window.location.href="/admin/newlist?page="+data.page;
						},300);
					}
				});
		}
	});


	/*图片上传*/

	imgUpLoadFun();

	function imgUpLoadFun(){
		 var imgLoadForm=$("#imgLoadForm");
		 var imgFile=$("#imgFile");
		 var upImgBtn=$("#upImgBtn");
		 var imgLook=$("#imgLook");
		  upImgBtn.on("click",function(){
			   if(imgFile.val()==""){
				   alert("你还没有选择图片");
				   return;
			   }
		  		var data=new FormData($("#imgLoadForm")[0]);
		  		$.ajax({
					url: '/imgLoad',
					type: 'POST',
					cache: false,
				     contentType: false, //不可缺参数
                     processData: false, //不可缺参数
					 data: data
				}).done(function(data) {
					if(data.error==0){
						var img="<img src='"+data.url+"' alt=''>";
						newImgLink=data.url;
						imgLook.html(img);
					}
				});

		  });
	}

	


})(jQuery)
/**
 * Created by chencm on 2016/11/2.
 */
var express=require("express");
var usertab=require("../../module/userdb");
var sorttab=require("../../module/sortdb");
var commentdb=require("../../module/commentdb");
var newlist=require("./newlist");
var focuslist=require("./focuslist");
var commentlist=require("./commentlist");
var tools=require("./tools");
var router=express.Router();


router.use("/newlist",newlist);  //新闻模块路由
router.use("/focuslist",focuslist);   //焦点图模块
router.use("/commentlist",commentlist); //评论模块


var limitNum=10;  //每页显示数据条数

/*管理首页*/
router.get("/",function(req,res,next){
	 res.render("admin/index",{
		 userinfo:req.userinfo,
		 mbxtit:"管理首页",
		 useradd:false      //增加用户功能
	 });
});

/*用户管理列表页*/
router.get("/userlist",function(req,res,next){
	var pagenum=req.query.page||1;      //获得当前页数
	var key=req.query.key||"";         //搜索用户名
	var selKey=(key)?{"username":key}:{};

	usertab.find(selKey).count().then(function(countNum){ //数据总数
			var page=tools.pageFun(pagenum,limitNum,countNum);
			usertab.find(selKey).limit(page.limitNum).skip(page.skipNum).then(function(dat){
					if(dat){
						var userlist=fDatSet(dat,limitNum);
						res.render("admin/userlist",{
							userinfo:req.userinfo,
							mbxtit:"用户管理",
							useradd:true,      //增加用户功能
							userlist:userlist,
							page:page,
							pagepath:"userlist",
							urlclass:"",	   //关键字
							key:key

						});
					}
			});
	});
	 function fDatSet(dat,limitNum){
		var jsonDat=[];
		dat.forEach(function(item,ind){
			  jsonDat[ind]=item;
			  jsonDat[ind].time=tools.timFormatFun(item.date);    //注册时间格式化
			  jsonDat[ind].isLine=item.isLine;  //判断是否在线
			  jsonDat[ind].sid=(ind+(pagenum-1)*limitNum)+1;     //用户编号
		});
		 return jsonDat;
	 }
});

/*用户编辑*/
router.get("/userlist/useredit",function(req,res,next){
		var page=req.query.page;
		var uid=req.query.id;
		if(!uid){
			res.redirect("/admin/error");
			return
		}
	   usertab.findOne({_id:uid}).then(function(dat){
		     if(dat){
				 dat.time=tools.timFormatFun(dat.date);
				 res.render("admin/userEdit",{userinfo:req.userinfo,mbxtit:"用户编辑", useradd:false,dateinfo:dat,page:page});
				 return;
			 }else{
				 res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
				 return;
			 }
	   });
});

/*密码初始化*/

router.post("/userlist/initpassword",function(req,res,next){
		var id=req.body.id;
		var pw="13579";
		if(id){
			  usertab.findOne({_id:id}).then(function(dat){
					if(dat){
						usertab.updatePassword({_id:id},{password:pw},function(){
							res.json({
								state:1,pw:pw
							});
						});
					}
			  });
		}else{
			res.redirect("/admin/error");
			return
		}
});




router.post("/userlist/useredit",function(req,res,next){
	var page=req.query.page;
	var postVal=req.body;
	var uid=postVal.uid;
	var password=postVal.password||"";
	var leve=postVal.leve;
	var isset=(postVal.isset==1)?true:false;
	var datjson={};
	if(!uid){
		res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
		return
	}
	if(password==""){
		datjson={leve:leve,isAdmin:isset};
	}else{
		datjson={password:password,leve:leve,isAdmin:isset};
	}
	usertab.updatePassword({_id:uid},datjson,function(err,dat){
		if(dat){
			req.session.userinfo.isAdmin=isset;
			setTimeout(function(){
				res.redirect("/admin/userlist?page="+page);    //编辑成功
				return;
			},500);
		}else{
			res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
			return;
		}
	});

});

/*增加用户*/
router.get("/useradd",function(req,res,next){
        var pagenum=req.query.page;
        usertab.find().count().then(function(countNum){ //数据总数
			var page=tools.pageFun(pagenum,limitNum,countNum);
            res.render("admin/useradd",{userinfo:req.userinfo,mbxtit:"添加用户", useradd:false,page:page});	
        });	
	
});

router.post("/useradd",function(req,res,next){
		var page=req.query.page;
		var username=req.body.username||"";
		var password=req.body.password||"";
		var vpassword=req.body.vpassword||"";
		var leve=req.body.leve||1;
		var isset=req.body.isset;
		var data=req.body.dataval;
		var isAdmin=(isset==1)?true:false;
	    usertab.findOne({username:data}).then(function(dat){
	    		
		    	if(dat){
			    		 res.json({val:1});  //用户名存在
			    		 return;
		    	}else{
						if(username!=""&&password!=""&&password==vpassword){					    	
				    		 var useradd=new usertab({
					              username:username,
					              password:password,
					              isAdmin:isAdmin,
					              leve:leve
					         });
					   		 useradd.save();						   		 	
			   		 		 usertab.find().count().then(function(countNum){ //数据总数
									 var page=tools.pageFun(page,limitNum,countNum);
							   		 setTimeout(function(){
											res.redirect("/admin/userlist?page="+page.pageNum);   
											return;
									 },500);
									 
							 });						   		
					   		 return;					   						
						}
						res.json({val:0}); 

				}
		});
});


/*删除用户*/

router.get("/userlist/userdel",function(req,res,next){
	var page=req.query.page;
	var uid=req.query.id;
	
	if(!uid){
		res.redirect("/admin/error");
		return
	}
	
	usertab.findOne({_id:uid}).then(function(dat){
				if(dat){
					dat.time=tools.timFormatFun(dat.date);
					res.render("admin/userdelete",{userinfo:req.userinfo,useradd:false,mbxtit:"删除用户",dateinfo:dat,page:page});
					return;
				}else{
					res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
					return;
				}
	});
			
});

router.post("/userlist/userdel",function(req,res,next){
	var page=req.query.page;
	var limitNum=req.query.limitNum;
	var postVal=req.body;
	var uid=postVal.uid;
	if(!uid){
		res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
		return
	}
	usertab.remove({_id:uid},function(err,dat){
			if(dat){
					// commentdb.remove({user:uid}).then(function(){
					// 		commentdb.update({reply},{$pull:{from:uid}}).then(function(){

									usertab.find().count().then(function(countNum){	
										page=(countNum%limitNum==0)?page-1:page;
										 //res.clearCookie("cookieMsg");
										setTimeout(function(){
											res.redirect("/admin/userlist?page="+page);    //删除成功
											return;
										},500);
									});

					// 		})



					// })
							
			}else{
				res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
				return;
			}
	});

});


/*
 *  分类页面管理
 * 
 */

/*分类列表页*/
router.get("/sortlist",function(req,res,next){

	sorttab.find().sort({'sortleve':-1}).then(function(dat){
		 if(dat){

		 	 res.render("admin/sortlist",{userinfo:req.userinfo,useradd:false,mbxtit:"分类列表",sortlist:dat});
		 }else{
		 	 res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
		 }
	});


});

/*分类编辑*/

router.get("/sortedit",function(req,res,next){
	var id=req.query.id;
	 if(id){
		 	sorttab.findOne({_id:id}).then(function(dat){
		 		 res.render("admin/sortedit",{userinfo:req.userinfo,useradd:false,mbxtit:"分类编辑",sortdat:dat});
	 		})
	 }else{
	 	   res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
	 }

});

router.post("/sortedit",function(req,res,next){
	var sortid=req.body.sortid||"";
	var sortname=req.body.sortname||"";
	var sortleve=req.body.sortleve||1;
	var dataval=req.body.dataval||"";
	var dataid=req.body.dataid||"";
	 if(dataid){	 	 
 		sorttab.findOne({_id:{$ne:dataid},sortname:dataval}).then(function(dat){
 			 if(dat){
 			 	res.json({val:1});   //分类名已经存在
 			 	return;
 			 }else{ 			 	  
			 	res.json({val:0}); 
			 	return;
		  	}
 		});
	 }
	 if(sortid){
		 	 sorttab.update({_id:sortid},{sortname:sortname,sortleve:sortleve}).then(function(dat){
		 	 	   if(dat){
		 	 	   		 res.redirect("/admin/sortlist"); 	
		 	 	   }else{
		 	 	   	     res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
		 	 	   }
					
			 });
	 }

});

/*分类删除*/

router.post("/sortlist",function(req,res,next){

		var sortListArr=req.body.sort||"";
		if(sortListArr){
			sorttab.remove({_id:{$in:sortListArr}}).then(function(dat){
				if(dat){
					sorttab.find().sort({'sortleve':-1}).then(function(dat){
						 res.render("admin/sortlist",{userinfo:req.userinfo,useradd:false,mbxtit:"分类列表",sortlist:dat});
					});
				}else{
					res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
					return;
				}
			});
		}

});

/*分类的添加*/

router.get("/sortadd",function(req,res,next){
	
	 res.render("admin/sortadd",{userinfo:req.userinfo,useradd:false,mbxtit:"分类添加"});
});

router.post("/sortadd",function(req,res,next){
	var sortname=req.body.sortname||"";
	var sortleve=req.body.sortleve||1;
	var dataval=req.body.dataval||"";
	 if(dataval){
		 	sorttab.findOne({sortname:dataval}).then(function(dat){
				if(dat){
				 	res.json({val:1});   //分类名已经存在
				 	return;
				}else{ 			 	  
				 	res.json({val:0}); 
				 	return;
			  	}
		    });
	 }		
    if(sortname){
    	 var addSort=new sorttab({sortname:sortname,sortleve:sortleve}).save();
 	 	 res.redirect("/admin/sortlist");  
    }
    
});





/*错误提示*/
router.get("/error",function(req,res,next){

	res.render("admin/error",{
		userinfo:req.userinfo,
		mbxtit:"错误提示",
		useradd:false,
	});
});




module.exports=router;
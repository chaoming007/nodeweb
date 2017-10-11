/**
 * Created by chencm on 2016/11/2.
 */
var express=require("express");
var usertab=require("../../module/userdb");
var pageFun=require("./page");
var router=express.Router();


router.use(function(req,res,next){
	 var isAdmin=req.userinfo?req.userinfo.isAdmin:false;
	 var sessionName=req.userinfo?req.session[req.userinfo.username]:0;
	 //if(isAdmin && sessionName==1){   //session 和cookie的双验证
	 if(isAdmin){
	 	next();
	 }else{
	 	res.send("你没有权限访问");
	 	return;
	 }
});

/*管理首页*/
router.get("/",function(req,res,next){
	 res.render("admin/index",{
		 userinfo:req.userinfo,
		 mbxtit:"管理首页"
	 });
});

/*用户管理列表页*/
router.get("/userlist",function(req,res,next){
	var pagenum=req.query.page||1;
	usertab.find().count().then(function(countNum){ //数据总数
			var limitNum=5;                      //每页显示的条数
			var skipNum=pagenum*limitNum-limitNum;
			var nextPage=parseInt(pagenum)+1;
			var prevPage=parseInt(pagenum)-1;
			var pages=Math.ceil(countNum/limitNum);   //总页数
		    var pageinfo=false;
		    if(pagenum>pages || pagenum<1 || isNaN(pagenum)){ pageinfo=true;}
		    prevPage=Math.max(1,prevPage);           //上一页
			nextPage=Math.min(pages,nextPage);       //下一页
		    limitNum=limitNum>countNum?countNum:limitNum;
			usertab.find().limit(limitNum).skip(skipNum).then(function(dat){
					if(dat){
						var userlist=fDatSet(dat,limitNum);
						res.render("admin/userlist",{
							userinfo:req.userinfo,
							mbxtit:"用户管理",
							userlist:userlist,
							page:{nextPage:nextPage,prevPage:prevPage,counts:countNum,limitNum:limitNum,pageNum:pages,currentPage:pagenum,pageinfo:pageinfo}
						});
					}
			});
	});
	 function fDatSet(dat,limitNum){
		var jsonDat=[];
		dat.forEach(function(item,ind){
			  jsonDat[ind]=item;
			  jsonDat[ind].time=timFormatFun(item.date);
			  jsonDat[ind].logstate=req.session[item.username];
			  jsonDat[ind].sid=(ind+(pagenum-1)*limitNum)+1;
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
				 dat.time=timFormatFun(dat.date);
				 res.render("admin/userEdit",{userinfo:req.userinfo,mbxtit:"用户编辑",dateinfo:dat,page:page});
				 return;
			 }else{
				 res.render("admin/error",{userinfo:req.userinfo,mbxtit:"数据不存在"});
				 return;
			 }
	   });
});

router.post("/userlist/useredit",function(req,res,next){
	var page=req.query.page;
	var postVal=req.body;
	var uid=postVal.uid;
	var password=postVal.password;
	var isset=(postVal.isset==1)?true:false;
	if(!uid){
		res.render("admin/error",{userinfo:req.userinfo,mbxtit:"数据不存在"});
		return
	}
	usertab.update({_id:uid},{password:password,isAdmin:isset},function(err,dat){
		if(dat){
			setTimeout(function(){
				res.redirect("/admin/userlist?page="+page);    //编辑成功
				return;
			},1000);
		}else{
			res.render("admin/error",{userinfo:req.userinfo,mbxtit:"数据不存在"});
			return;
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
					dat.time=timFormatFun(dat.date);
					res.render("admin/userdelete",{userinfo:req.userinfo,mbxtit:"删除用户",dateinfo:dat,page:page});
					return;
				}else{
					res.render("admin/error",{userinfo:req.userinfo,mbxtit:"数据不存在"});
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
		res.render("admin/error",{userinfo:req.userinfo,mbxtit:"数据不存在"});
		return
	}
	usertab.remove({_id:uid},function(err,dat){
			if(dat){
				usertab.find().count().then(function(countNum){	
					page=(countNum%limitNum==0)?page-1:page;
					 res.clearCookie("cookieMsg");
					setTimeout(function(){
						res.redirect("/admin/userlist?page="+page);    //删除成功
						return;
					},1000);
				});

			}else{
				res.render("admin/error",{userinfo:req.userinfo,mbxtit:"数据不存在"});
				return;
			}
	});

});








/*错误提示*/
router.get("/error",function(req,res,next){





	res.render("admin/error",{
		userinfo:req.userinfo,
		mbxtit:"错误提示"
	});
});



function timFormatFun(tim){
	var timeval=new Date(tim);
	timeval=timeval.getFullYear()+"-"+(timeval.getMonth()+1)+"-"+timeval.getDate()+"("+timeval.getHours()+":"+timeval.getMinutes()+":"+timeval.getSeconds()+")";
	return timeval;
}



module.exports=router;
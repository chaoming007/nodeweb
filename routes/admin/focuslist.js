var express=require("express");
var focus=require("../../module/focusdb");
var fs=require("fs");
var router=express.Router();



/*焦点图列表*/
router.get("/",function(req,res,next){
	 focus.find().sort({show:-1}).then(function(dat){
			 if(dat){
				 res.render("admin/focuslist",{
					 userinfo:req.userinfo,
					 mbxtit:"焦点图管理",
					 useradd:false,     //增加用户功能不显示
					 data:dat
				 });
			 }else{
				 res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
			 }
	 });

});

/*焦点图的删除*/

router.post("/",function(req,res,next){
	var imgListArr=req.body.imgs||" ";
	var arr=[];
	if(imgListArr!=" "){
		focus.find({_id:{$in:imgListArr}}).then(function(dat){
			dat.forEach(function(item,index){
				if(item.src){
					var dirname=process.cwd()+item.src;
					if(fs.existsSync(dirname)){
						fs.unlinkSync(dirname);
					}
				}
			});
			focus.remove({_id:{$in:imgListArr}}).then(function(err){
				res.redirect("/admin/focuslist");
			});
		});
	}

})

/*添加焦点图*/
router.get("/focusadd",function(req,res,next){
	    var id=req.query.id;
		var dat={};
	    if(id){
			focus.findOne({_id:id}).then(function(rs){
				 dat={
					 title:rs.title,
					 src:rs.src,
					 link:rs.link,
					 show:rs.show,
					 id:id
				 };
				res.render("admin/focusadd",{
					userinfo:req.userinfo,
					mbxtit:"焦点图管理",
					useradd:false,     //增加用户功能不显示
					data:dat
				});
				return;
			});
		}else{
				res.render("admin/focusadd",{
					userinfo:req.userinfo,
					mbxtit:"焦点图管理",
					useradd:false,     //增加用户功能不显示
					data:dat
				});
		}
});

router.post("/focusadd",function(req,res,next){
	var dat=req.body;
	if(dat){
		new focus({
			src:dat.imglink||"",
			title:dat.title||"",
			show:dat.show||1,
			link:dat.link||""
		}).save().then(function(rs){
			res.json({status:1,info:"发布成功"});
		});
	}
});
router.post("/focusupdata",function(req,res,next){
	var dat=req.body;
	if(dat.id){
		focus.update({_id:dat.id},{
			src:dat.imglink||"",
			title:dat.title||"",
			show:dat.show||1,
			link:dat.link||""
		}).then(function(rs){
			res.json({status:1,info:"更新成功"});
		});
	}
});





module.exports=router;

/**
 * Created by chencm on 2016/11/2.
 */
var express=require("express");
var commentdb=require("../../module/commentdb");
var usertab=require("../../module/userdb");
var tools=require("./tools");
var router=express.Router();



var limitNum=20;  //每页显示数据条数

/*评论列表*/
router.get("/",function(req,res){
	var pagenum=req.query.page||1;
	var key=req.query.key||"";
	var page;
	var reg=new RegExp(key,"gi");
	var cond;

	usertab.find({username:reg}).then(function(udat) {
		var arr=userArrFun(udat);
		if(arr[0]){
			cond={user:{$in:arr}};
		}else{
			cond={};
		}

		commentdb.find(cond).count().then(function (countNum) {
			page = tools.pageFun(pagenum, limitNum, countNum);
			commentdb.find(cond).sort({date: -1}).populate("news", "_id title").populate("user", "username").limit(page.limitNum).skip(page.skipNum).then(function (dat) {
				if (dat) {
					res.render("admin/commentlist", {
						userinfo: req.userinfo,
						mbxtit: "评论管理",
						useradd: false,      //增加用户功能
						cdat: dat,
						page: page,
						pagepath: "commentlist",
						urlclass:"&key="+key,	   //关键字
						key:key
					});
				} else {
					res.redirect("/admin");
				}
			})

		});

	});

	function userArrFun(dat){
		var namearr=[];
		dat.forEach(function(item,ind){
			namearr.push(item._id);
		});
		return namearr;
	}

});


/*评论删除*/

router.post("/",function(req,res){
	var commentListArr=req.body.comments||"";
	if(commentListArr[0]){
		commentdb.remove({_id:{$in:commentListArr}}).then(function(){
			res.redirect("/admin/commentlist");
		})

	}

});

/*评论详情*/

router.get("/commentdel",function(req,res){
	var id=req.query.id;
	var page=req.query.page||1;
	if(id){
		commentdb.find({news:id}).sort({date: -1}).populate("news", "title").populate("user reply.from reply.to", "username username username").then(function(dat){

				res.render("admin/commentdel", {
					userinfo: req.userinfo,
					mbxtit: "评论详情",
					useradd: false,     //增加用户功能
					dat: dat,
					page:page
				});
		});

	}else{
		res.redirect("/admin/commentlist");
	}

});

/*删除盖条新闻所有评论*/
router.post("/delcomment",function(req,res){
		var dat=req.body;
	    if(dat.newId){
			commentdb.remove({news:dat.newId}).then(function(){
				//res.redirect("/admin/commentlist?page="+dat.page);
				res.json({state:1});
			})
		}else{
			res.redirect("/admin/commentlist");
		}

});

/*删除单条评论*/
router.post("/delonecomment",function(req,res){
	var dat=req.body;
	if(dat.cid && dat.nid){
		commentdb.remove({_id:dat.cid}).then(function(){
			commentdb.find({news:dat.nid}).then(function(dat){
				if(dat[0]){
					res.json({state:1});
				}else{
					res.json({state:2});
				}
			})
		})
	}else{
		res.redirect("/admin/commentlist");
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
/**
 * Created by chencm on 2016/10/26.
 */
var express=require("express");
var usertab=require("../module/userdb");
var sorttab=require("../module/sortdb");
var newtab=require("../module/articledb");
var commentdb=require("../module/commentdb");
var promise=require("bluebird");
var focus=require("../module/focusdb");
var tool=require("./admin/tools");
var router=express.Router();

//首页渲染

router.get("/",function(req,res,next){
		var datArr={};

	    new Promise(function(resolve,reject){							//导航数据

			sorttab.find({sortleve:{$gt:0}}).sort({'sortleve':-1}).then(function(dat){
				datArr.sort=dat;
				resolve();
			});

		}).then(function(){


				return	 new Promise(function(resolve,reject){
					newtab.find({show: {$gt: 0}}).sort({time: -1}).limit(5).then(function (dat) {   //最新文章
						datArr.newarticle = dat;
						resolve();
					})
				})

		}).then(function(){

				return	 new Promise(function(resolve,reject){
					newtab.find({show: {$gt: 0}}).sort({looknum: -1}).limit(5).then(function (dat) {   //热门文章
						datArr.hotarticle = dat;
						resolve();
					})
				})

		}).then(function(){

			 return	 new Promise(function(resolve,reject){
					focus.find({show: {$gt: 0}}).sort({show: -1}).then(function (dat) {   //焦点图
						datArr.focusImg = dat;
						resolve();
					})
			 })

		}).then(function(){

			return	 new Promise(function(resolve,reject){
				newtab.find({show: {$gt: 0}}).sort({'show': -1}).limit(3).populate("newclass").then(function (newdat) {  //列表数据
					var dat = [];
					newdat.forEach(function (item, ind) {
						var str = "";
						dat[ind] = item;
						str = tool.filterHtml(item.content); //过滤html字符
						dat[ind].intro = tool.conduct(str, 280);//截取240个字
						dat[ind].sort = item.newclass.sortname;
					});
					datArr.newlist = dat;
					resolve();
				});
			})

		}).then(function(){
				res.render("index",{           //渲染
					reponseJson:res.reponseJson, //登录数据
					sortlist:datArr.sort,     //导航
					newdat:datArr.newlist,    //新闻列表
					focusdat:datArr.focusImg,  //焦点图
					hotarticle:datArr.hotarticle,  //热门文章
					newarticle:datArr.newarticle //最新文章
				});
		})

});


/*新闻详情页*/
router.get("/newdetail",function(req,res,next){
	var datArr={};
	var id=req.query.id;
	if(id){

			 new Promise(function(resolve,reject){				//导航数据
					sorttab.find({sortleve:{$gt:0}}).sort({'sortleve':-1}).then(function(dat){
						 datArr.sort=dat;
						 resolve();
					});
			}).then(function() {
				 return new Promise(function(resolve,reject){       //新闻数据
					 newtab.findOne({_id:id}).then(function(dat){
						 datArr.newdat=dat;
						 resolve();
					 });
				 })
		    }).then(function(){
				 return new Promise(function(resolve,reject){              //评论
					 commentdb.find({news:id}).populate("user").populate("reply.from reply.to").sort({date:-1}).limit(10).then(function(dat){
						 datArr.comment=dat;
						 resolve();
					 });
				 })
			}).then(function(){
					 return new Promise(function(resolve,reject){              //评论数量
						 commentdb.find({news:id}).count().then(function(dat){
							 datArr.commentCountNum=dat;
							 resolve();
						 });
					 })
			 }).then(function(){
				 return new Promise(function(resolve,reject){              //热点推荐无图
					 newtab.find({show:{$gt:0}}).sort({looknum:-1}).limit(8).then(function(dat){
						 datArr.hotNew=dat;
						 resolve();
					 });
				 })
			}).then(function(){
				return new Promise(function(resolve,reject){              //热点推荐有图
					newtab.find({show:{$gt:0}}).sort({'show':-1}).populate("newclass").limit(2).then(function(dat){
						dat.forEach(function(item){
							item.tim=tool.yearFormatFun(item.time);
						});
						datArr.hotNewImg=dat;
						resolve();
					})
				})
			}).then(function(){
					 res.render("newdetail",{
						 reponseJson:res.reponseJson,
						 sortlist:datArr.sort,
						 newdat:datArr.newdat,
						 commentdat:datArr.comment, //新闻评论
						 commentCountNum:datArr.commentCountNum, //评论数量
						 hotdat:datArr.hotNew,     //热点推荐无图
						 dImg:datArr.hotNewImg	  //热点推荐有图
					 });
		    })
	}else{
		res.redirect("/");
	}

	// function  commentArr(dat){
	// 	dat.forEach(function(item,ind){
	// 			item.tim=tool.timFormatFun(item.date);
	// 	});
	// 	return dat;
	// }

});

/*发表评论*/

router.post("/comment",function(req,res,next){
	var txt=req.body.commenttxt || "";
	var comment=req.body;
	if(comment.userId=="" || comment.from==""){    //没有登录
		res.json({
			state:0
		})
		return;
	}

	if(comment.mainCommentId){         //子回复
		  commentdb.findOne({_id:comment.mainCommentId}).then(function(dat){
		  		var reply={
		  			content:comment.rcontent,
		  			from:comment.from,
		  			to:comment.to,
		  			tim:comment.hftim
		  		};
		  		dat.reply.push(reply);
		  		dat.save(function(){
					 commentdb.find({news:comment.newCommentId}).populate("user","_id username").populate("reply.from reply.to","_id username").sort({date:-1}).limit(10).then(function(dat){
								res.json({state:1,dat:dat,reponseJson:res.reponseJson.cookieJson._id})
						 }
				     );
				});
		  })

	}else{              //主回复
			if(txt){
				 var comments=new commentdb({
				 		news:comment.newId,
				 		user:comment.userId,
				 		content:txt,
				 		date:comment.tim
				 }).save(function(){
					 commentdb.find({news:comment.newId}).populate("user","_id username").populate("reply.from reply.to","_id username").sort({date:-1}).limit(10).then(function(dat){
						/*更新新闻评论数*/
						 newtab.update({_id:comment.newId},{$inc:{commentnum:1}}).then(function(){
							 res.json({state:1,mid:1,dat:dat,reponseJson:res.reponseJson.cookieJson._id});
						 })

					 });
				 });

			}else{
				res.redirect("/");
			}
	}

});



/* 新闻列表 */
var newLimitNum=5;
router.get("/newlist",function(req,res,next){
		var id=req.query.kw || "";
		var contJson;

	    if(id){
			contJson={show:{$gt:0},"newclass":id};
		}else{
			contJson={show:{$gt:0}};
		}
		sorttab.find({sortleve:{$gt:0}}).sort({'sortleve':-1}).then(newFun);   //导航数据
		function newFun(sortdat){
				newtab.find(contJson).count().then(function(countNum){
						newtab.find(contJson).sort({'time':-1}).limit(newLimitNum).populate("newclass").then(function(newdat){  //列表数据
								var dat=[];
								newdat.forEach(function(item,ind){
									var str="";
									dat[ind]=item;
									str=tool.filterHtml(item.content); //过滤html字符
									dat[ind].intro=tool.conduct(str,400);//截取240个字
									dat[ind].sort=item.newclass.sortname;
								});
								datFun(dat,sortdat,countNum);
						});
				})
		}

		function datFun(dat,sortdat,countNum){
			res.render("newlist",{
				reponseJson:res.reponseJson,
				newdat:dat,
				sortlist:sortdat,
				countNum:countNum,      //数据总数
				newLimitNum:newLimitNum,//每页显示的数据数
				wid:id    //已选类别id
			});
		}
});

/*加载更多*/
router.post("/newlist",function(req,res,next) {
	var num = req.body.pnum;   //加载数量
	var cid=req.body.cid;      //类别
	var page=req.body.page;    //页码数
	var contJson={};
	var skipNum=newLimitNum+((page-1)*num);
	var moreState=true;          //更多是否显示
	var cnum=newLimitNum+page*num;  //已经显示的总数
	num=parseInt(num);

	if (cid) {
		contJson = {show: {$gt: 0}, "newclass": cid};
	} else {
		contJson = {show: {$gt: 0}};
	}
	newtab.find(contJson).count().then(function(countNum){
		    moreState=(cnum>=countNum)?false:true;
			newtab.find(contJson).sort({'time': -1}).skip(skipNum).limit(num).populate("newclass").then(function (newdat) {
					if(newdat.length>=1){
						var dat=[];
						newdat.forEach(function(item,ind){
							//var datdb={};
							//datdb=item;
							dat[ind]=item;
							var str=tool.filterHtml(dat[ind].content); //过滤html字符
							dat[ind].content=tool.conduct(str,400);    //截取400个字
							dat[ind].newclass=dat[ind].newclass.sortname;
						});
						res.json({state:1, newdat:dat,moreState:moreState});
					}else{
						res.json({state:0});
					}
			})
	})

})







//router.get("/list_part",function(req,res,next){
//	// 新闻列表
//	newtab.find({show:{$gt:0}}).sort({'looknum':-1}).then(function(dat){
//			res.render("list_part",{
//				  newdat:dat
//			});
//	});
//
//});





module.exports = router;

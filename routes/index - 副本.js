/**
 * Created by chencm on 2016/10/26.
 */
var express=require("express");
var usertab=require("../module/userdb");
var sorttab=require("../module/sortdb");
var newtab=require("../module/articledb");
var focus=require("../module/focusdb");
var tool=require("./admin/tools");
var router=express.Router();

//首页渲染

router.get("/",function(req,res,next){

		sorttab.find({sortleve:{$gt:0}}).sort({'sortleve':-1}).then(focusDB);   //导航数据
		function focusDB(sortdat){
			focus.find({show:{$gt:0}}).sort({show:-1}).then(function(focusdat){ //焦点图
				newlist(focusdat,sortdat);
			})			
		}
		
	    function newlist(focusdat,sortdat){
			newtab.find({show:{$gt:0}}).sort({'show':-1}).limit(3).populate("newclass").then(function(newdat){  //列表数据
				var dat=[];
				newdat.forEach(function(item,ind){
					 var str="";
					 dat[ind]=item;
					 str=tool.filterHtml(item.content); //过滤html字符
					 dat[ind].intro=tool.conduct(str,240);//截取240个字
					 dat[ind].sort=item.newclass.sortname;
				});
				render(focusdat,sortdat,dat);
			});
		}

	   // //渲染
	   function render(focusdat,sortdat,dat){
		   res.render("index",{
			   reponseJson:res.reponseJson,
			   sortlist:sortdat,
			   newdat:dat,
			   focusdat:focusdat
		   });
	   }

});


/*新闻详情页*/
router.get("/newdetail",function(req,res,next){
	var id=req.query.id;
	if(id){
			sorttab.find({sortleve:{$gt:0}}).sort({'sortleve':-1}).then(newDb);   //导航数据
			function newDb(sortdat){
				newtab.findOne({_id:id}).then(function(newdat){
					hotNew(sortdat,newdat);
				});
			}
		    function hotNew(sortdat,newdat){		//热点推荐无图
				newtab.find({show:{$gt:0}}).sort({looknum:-1}).limit(8).then(function(hotdat){
					hotdat.forEach(function(item){
						item.tim=tool.yearFormatFun(item.time);
					});
					hotImgNew(sortdat,newdat,hotdat);
				});
			}
		    function hotImgNew(sortdat,newdat,hotdat){     //热点推荐有图
				newtab.find({show:{$gt:0}}).sort({'show':-1}).populate("newclass").limit(2).then(function(dImg){
					dImg.forEach(function(item){
						item.tim=tool.yearFormatFun(item.time);
					});
					news(sortdat,newdat,hotdat,dImg)
				});
			}
		    function news(sortdat,newdat,hotdat,dImg){
				newlist(sortdat,newdat,hotdat,dImg);
			}

			function newlist(sortdat,newdat,hotdat,dImg){
				res.render("newdetail",{
					reponseJson:res.reponseJson,
					sortlist:sortdat,
					newdat:newdat,
					hotdat:hotdat,     //热点推荐无图
					dImg:dImg		   //热点推荐有图
				});
			}
	}else{
		res.redirect("/");
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

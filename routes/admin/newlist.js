/**
 * Created by chencm on 2016/11/2.
 */
var express=require("express");
var usertab=require("../../module/userdb");
var newtab=require("../../module/articledb");
var sorttab=require("../../module/sortdb");
var commentdb=require("../../module/commentdb");
var fs=require("fs");
var tools=require("./tools");
var router=express.Router();




		var limitNum=5;  //每页显示数据条数
		var imgsrc="/public/images/mrt_img.jpg"; //默认图片地址
		var imgdir="public";  //图片存储的根目录名字

		/*文章列表页*/

		router.get("/",function(req,res,next){
			var pagenum=req.query.page||1;     //获得当前页数
			var selclass=req.query.val||1;    //分类
			var key=req.query.key||"";         //关键词
			var selnum;                       //查询条件
			var urlclass;				     //类别url
			var page;
			var keyword=new RegExp(key,"gi");  //关键词
			sorttab.find().then(function(sortdat){
					if(!selclass||selclass==1){
						selnum={"title":keyword};
					}else{
						selnum={"newclass":selclass,"title":keyword};
					}

					urlclass="&val="+selclass+"&key="+key;

					newtab.find(selnum).count().then(function(countNum){ //数据总数
							page=tools.pageFun(pagenum,limitNum,countNum);
							newtab.find(selnum).sort({'show':-1}).limit(page.limitNum).skip(page.skipNum).populate("newclass").then(function(dat){
									if(dat){
										var newlist=fDatSet(dat,limitNum);
										res.render("admin/newlist",{
											userinfo:req.userinfo,
											mbxtit:"文章列表",
											useradd:false,      //增加用户功能不显示
											newlist:newlist,
											page:page,
											pagepath:"newlist",
											sortdat:sortdat,       //分类数据
											urlclass:urlclass,	   //关键字
											selclass:selclass,      //已选择分类的值
											key:key                //关键词
										});
									}
								
							});
					});
			});

			 function fDatSet(dat,limitNum){
				var jsonDat=[];
				dat.forEach(function(item,ind){
					  jsonDat[ind]=item;
					  jsonDat[ind].time=tools.timFormatFun(item.time);    //时间格式化
					  jsonDat[ind].sid=(ind+(pagenum-1)*limitNum)+1; //新闻编号
					  jsonDat[ind].sort=item.newclass.sortname
				});
				 return jsonDat;
			 }
		});

		/*文章的级别更新*/
		//router.post("/newlist/newshow",function(req,res,next){
		//		var dat=req.body;
		//	    if(dat){
		//			newtab.update({_id:{$each:dat.dId}},{show:{$each:dat.dVal}}).then(function(data){
		//					res.redirect("/admin/newlist");
		//			});
		//		}
		//});


		/*文章的删除*/

		router.post("/",function(req,res,next){

				var newListArr=req.body.news||"";
				var page=req.query.page||1;
				var arr=[];
				if(newListArr){
					 newtab.find({_id:{$in:newListArr}}).then(function(sdat){
					 	    //删除新闻中上传的图片
					 		sdat.forEach(function(item,ind){
								var srcArr=tools.searchImg(item.content);
								if(srcArr){
									arr.push(srcArr);
								}
					 		});
						    if(arr[0]){
									arr.forEach(function(item,ind){
										item.forEach(function(iArr,i){
											var n=iArr.indexOf("/")+1;
											var str=iArr.substr(n,imgdir.length);
											if(str==imgdir){
												var dirname=iArr.substring(iArr.indexOf("\"")+1,iArr.indexOf("\"",5));
												dirname=process.cwd()+dirname.replace(/\//,"\\");
												if(fs.existsSync(dirname)){
													fs.unlinkSync(dirname);
												}
											}
										})
									});
							}
					 		//删除新闻
							 newtab.remove({_id:{$in:newListArr}}).then(function(dat){
							 	
							 	if(dat){
							 			commentdb.remove({news:{$in:newListArr}}).then(function(){

							 				 newtab.find().count().then(function(countNum){ //数据总数
								 			 	      
									 			 	  if(countNum<=0){
									 			 	  		res.redirect("/admin/newlist");
									 			 	  		//return;
									 			 	  }
								 			 		page=(countNum%limitNum==0)?page-1:page;
								 			 		res.redirect("/admin/newlist?page="+page);
								 			 });

							 			})

							 	}else{
							 		res.render("admin/error",{userinfo:req.userinfo,useradd:false,mbxtit:"数据不存在"});
							 		return;
							 	}
							 });
			 		})
					
				}

		});

		/*编辑文章*/
		router.get("/newedit",function(req,res,next){
				var id=req.query.nid;
				var page=req.query.page;
			    if(id){
					var newdat={};
					sorttab.find().then(editFun);
					function editFun(sortdat){
							newtab.findOne({_id:id}).then(function(dat){
								newdat=dat;
								newdat.newImg=dat.newImg||imgsrc;
								res.render("admin/newadd",{
									userinfo:req.userinfo,
									mbxtit:"编辑文章",
									useradd:false,      //增加用户按钮隐藏
									sortdat:sortdat,          //分类
									newdat:newdat,           //编辑的文章内容
									page:page
								})
							});
					}
				}else{
					 res.redirect("/admin/newlist");
				}
		});

		router.post("/newedit",function(req,res,next){
			var datalist=req.body;
			var page=datalist.page||1;
			var newImgSrc=datalist.newImgSrc||"";
			if(datalist.id){
				newtab.update({_id: datalist.id}, {
					title: datalist.title,
					newclass: datalist.newclass,
					author: datalist.author,
					source: datalist.source,
					time: datalist.time,
					keyword: datalist.keyword,
					content: datalist.newcontent,
					show:datalist.show,
					newImg: newImgSrc
				}).then(function (dat) {
					if (dat) {
						res.json({
							status: 1,
							info: "更新成功",
							page:page
						});
					}
				});
			}
		});



		/*添加文章*/

		router.get("/newadd",function(req,res,next){
			var page=req.query.page;
			var ndat={};
		   sorttab.find().then(function(dat){
		   			res.render("admin/newadd",{
						userinfo:req.userinfo,
						mbxtit:"添加文章",
						useradd:false,      //增加用户按钮隐藏
						sortdat:dat,          //分类
						newdat:ndat,
						page:page
					});
		   });

		});

		router.post("/newadd",function(req,res,next){
			var datalist=req.body;
			var page=datalist.page||1;
			var newImgSrc=datalist.newImgSrc||imgsrc;
			if(datalist.title!=""){
				var cont=new newtab({
					title:datalist.title,
					newclass:datalist.newclass,
					author:datalist.author,
					source:datalist.source,
					time:datalist.time,
					keyword:datalist.keyword,
					content:datalist.newcontent,
					show:datalist.show||1,
					newImg:newImgSrc
				});
				cont.save(function(err,dat){
					if(dat){
						res.json({
							status:1,
							page:page
						});
					}
				});
			}

		})




		/*错误提示*/
		router.get("/error",function(req,res,next){
			res.render("admin/error",{
				userinfo:req.userinfo,
				mbxtit:"错误提示",
				useradd:false,
			});
		});


//}
module.exports=router;		
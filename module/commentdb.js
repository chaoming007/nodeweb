/**
 * Created by chencm on 2016/10/31.
 */
var mongoose=require("mongoose");

/* 评论表 */
var comment=new mongoose.Schema({

	news:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"newstab"
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"usertabs"
	},
	reply:[
		{
			from:{ type:mongoose.Schema.Types.ObjectId,ref:"usertabs"},
			to:{ type:mongoose.Schema.Types.ObjectId,ref:"usertabs"},
			content:String,
			tim:String

		}

	],

	content:String,
    date:{type:String,default:Date.now}     //时间

});
var commenttab=mongoose.model("commenttab",comment);

module.exports=commenttab;










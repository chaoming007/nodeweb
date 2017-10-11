/**
 * Created by chencm on 2016/10/31.
 */
var mongoose=require("mongoose");

/* 分类表 */
var sort=new mongoose.Schema({
    sortname:String,                      //分类名称
    sortleve:{type:Number,default:1} ,	  //分类级别
    date:{type:Date,default:Date.now}     //分类创建时间
});
var sort=mongoose.model("sorttabs",sort);


module.exports=sort;










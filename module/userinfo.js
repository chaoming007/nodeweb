/**
 * Created by chencm on 2016/10/31.
 */
var mongoose=require("mongoose");
var mong=new mongoose.Schema({
     netname:String,    //网名
     jobs:String,       //职业
     place:String,      //籍贯
     tel:Number,        //电话
     mail:String        //邮箱
});
var userinfo=mongoose.Model("userinfo",mong);

module.exports=userinfo;


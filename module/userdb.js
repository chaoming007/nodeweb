/**
 * Created by chencm on 2016/10/31.
 */
var mongoose=require("mongoose");
var tool=require("../routes/admin/tools");
var CONT_NUM="chenchaoming843728";

/* 用户表 */
var mong=new mongoose.Schema({
    username:String,                      //用户名
    password:String,                      //密码
    isAdmin:{type:Boolean,default:false}, //是否是管理员
    isLine:{type:Number,default:0},       //是否在线
    leve:{type:Number,default:1},         //权限级别
    date:{type:Date,default:Date.now}     //时间
});

mong.pre("save",function(next){
    var user=this;
    if(user.password){
       user.password=tool.encrypt(user.password,CONT_NUM);
    }
    next();
});

//mong.pre("update",function(next){
//    var user=this;
//    user.password=tool.encrypt(user.password,CONT_NUM);
//    next();
//});
mong.statics={
    updatePassword: function(selJson,changJson,cb) {
    	if(changJson.password){
    		 var pw=tool.encrypt(changJson.password,CONT_NUM);
       		 changJson.password=pw;
    	}
        return this.update(selJson,changJson).exec(cb);
    }
}

mong.methods={
    comparePassword:function(_password){
        var passwordVal=tool.encrypt(_password,CONT_NUM);
        if(passwordVal===this.password){
            return true;
        }else{
            return false;
        }
    }
}

var user=mongoose.model("usertabs",mong);

module.exports=user;









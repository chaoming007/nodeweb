 /**
 * Created by chencm on 2016/11/2.
 */
var express=require("express");
var router=express.Router();

router.use(function(req,res,next){
	 var sessionVal=req.session.userinfo||"";
	 var isAdmin=sessionVal?sessionVal.dat.isAdmin:false;
	 if(isAdmin && sessionVal.dat.leve>1){
	 	next();
	 }else{
	 	res.send("你没有权限访问");
	 	return;
	 }
});


module.exports=router;
/**
 * Created by chencm on 2016/11/2.
 */
exports.setCookieFun=function(arg,val){
	//console.log(arg);
	 arg.cookie("cookieMsg",val,{maxAge:24*60*60*1000,httpOnly:true,path:"/",secret:false,signed: false});
}

exports.setSessionFun=function(arg,val){
	 arg.session.userinfo={dat:val};
	
}
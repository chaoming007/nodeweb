/**
 * Created by chencm on 2016/11/2.
 */
var express=require("express");
var usertab=require("../module/userdb");
var tool=require("./admin/tools.js");
var setconfig=require("./admin/setconfig");
var app=express();
var router=express.Router();


/*登录*/

router.post("/login",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    if(username==""){
        res.reponseJson.stateNum=1;
        res.reponseJson.message="请输入账号";
        res.json(res.reponseJson);
        return;

    }else if(password==""){
        res.reponseJson.stateNum=2;
        res.reponseJson.message="请输入密码";
        res.json(res.reponseJson);
        return;

    }else{
        usertab.findOne({username:username},
            function(err,dat) {
                  if(dat){
                       
                           if(dat.comparePassword(password)){
                               var datmsg={
                                  username:dat.username
                               };
                               res.reponseJson.stateNum=0;
                               res.reponseJson.message="登陆成功";
                               res.reponseJson.userinfo=dat.username;
                      

                               var cookVal=tool.encrypt(JSON.stringify(datmsg),tool.cooknum);
                               setconfig.setCookieFun(res,cookVal);
                               setconfig.setSessionFun(req,dat);
                    
                               usertab.update({username:username,password:password},{isLine:1}).then(function(dat){
                                   res.json(res.reponseJson);
                               });
                               return;

                           }else{
                               res.reponseJson.stateNum=3;
                               res.reponseJson.message="账号或密码错误";
                               res.json(res.reponseJson);
                               return;
                           }

                  }else{
                      res.reponseJson.stateNum=4;
                      res.reponseJson.message="账号或密码错误";
                      res.json(res.reponseJson);
                      return;

                  }

            }
        )

    }

});

/*注册*/
router.post("/reg",function(req,res,next){
        var reginfo={
            statusNum:0
        };
        var regusername=req.body.regusername;
        var regpassword=req.body.regpassword;
        var vregpassword=req.body.vregpassword;
        if(regusername==""){
            reginfo.message="用户名不能为空";
            reginfo.statusNum=1;
            res.json(reginfo);
            return;
        }
        if(regpassword==""){
            reginfo.message="密码不能为空";
            reginfo.statusNum=2;
            res.json(reginfo);
            return;
        }
        if(regpassword!==vregpassword){
            reginfo.message="两次密码输入不一样";
            reginfo.statusNum=3;
            res.json(reginfo);
            return;
        }

       /*检测用户名是否已经被注册*/
        usertab.findOne({username:regusername}).then(function(dat){
             if(dat){
                 reginfo.message="用户名已经存在";
                 reginfo.statusNum=4;
                 res.json(reginfo);
                 return;
             }else{
                 regSuccess();
                 reginfo.message="注册成功";
                 reginfo.statusNum=0;
                 res.json(reginfo);
                 return;
             }
        });

        /*注册成功函数*/
        function regSuccess(){
             var reguser=new usertab({
                  username:regusername,
                  password:regpassword
             });
             reguser.save();
        }

});

// /*退出*/
router.post("/clear",function(req,res,next){
    var quitVal=req.body.quitVal;
    var jsonVal={};
    if(quitVal=="clear"){
       // usertab.update({username: req.userinfo.username,password:req.userinfo.password},{isLine:0}).then(function(dat){
            res.clearCookie("cookieMsg");
            delete req.session.userinfo;
            res.reponseJson.userinfo="";
            jsonVal.num=1;
            res.json(jsonVal);
      //  });
    }

});







module.exports = router;
/**
 * Created by chencm on 2016/10/26.
 */
var formidable = require('formidable');
var fs=require("fs");
var index=require("./index");
var register=require("./register");
var admin=require("./admin/admin");
var visit=require("./admin/visit");
var tool=require("./admin/tools.js");


module.exports=function(app){


app.use(function(req,res,next){
     var reponseJson={};
     var sessionDat;
     reponseJson.cookieJson="";
    if(req.cookies.cookieMsg && req.session.userinfo){
        var cookVal=JSON.parse(tool.decrypt(req.cookies.cookieMsg,tool.cooknum))||"";
        sessionDat=req.session.userinfo;
        if(cookVal.username===sessionDat.dat.username){
            req.userinfo=sessionDat.dat;
            reponseJson.cookieJson=sessionDat.dat;
        }
    }
    res.reponseJson=reponseJson;
    next();
});





app.use("/",index);
app.use("/register",register);
app.use("/admin",visit,admin);

// app.use("/admin/newlist",visit,newlist);
// app.use("/admin/focuslist",visit,focuslist);



app.post('/uploadImg',function(req,res,next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir =process.cwd()+'/public/upload';
    form.parse(req, function (err, fields, files) {
        if (err) {throw err;}
        var image = files.imgFile;
        var path = image.path;
        path = path.replace(/\\/g, '/');
        var url = '/public/upload' + path.substr(path.lastIndexOf('/'), path.length);
        var info = {"error": 0, "url": url};
        res.json(info);
    });
});

app.post('/imgLoad',function(req,res,next) {
	 console.log(process.cwd());
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.encoding = 'utf-8'; //设置编码
    form.maxFieldsSize = 1 * 1024 * 1024; //文件大小
    form.uploadDir =process.cwd()+'/public/newimg';
    form.parse(req, function (err, fields, files) {
        if (err) {throw err;}
        var info={};
        var tuff=0;
        var image = files.imgFile;
        var path = image.path;
        if(image.size>form.maxFieldsSize){
            info={"error": 1, "msg":"文件超过规定大小"};
            res.json(info);
            return;
        }
        var extName="";
        switch(image.type){
            case 'image/jpeg':
                extName = 'jpeg';
                break;
            case 'image/jpg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
            case 'image/gif':
                extName = 'gif';
                break;
            default:
                info={"error": 2, "msg":"文件格式不符合"};
                res.json(info);
                fs.unlink(path);
                tuff=1;
                return false;
        }
        if(tuff===0){
            path = path.replace(/\\/g, '/');
            var newname="/"+String(Math.random()*1000).replace(/\./,"_")+new Date().getTime()+"."+extName;
            var oldname=(path.substr(path.lastIndexOf('/'), path.length));
            fs.rename(form.uploadDir+oldname,form.uploadDir+newname);
            var url = '/public/newimg' + newname;
            info = {"error": 0, "url": url};
            res.json(info);
        }
    });
});

app.use("*",function(req,res,next){
   res.send("页面不存在");
});




}













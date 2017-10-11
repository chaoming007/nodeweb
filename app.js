/**
 * Created by chencm on 2016/10/26.
 */
var express=require("express");
var mongoose=require("mongoose");
var path=require("path");
var os=require("os");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var favicon = require('express-favicon');
var MongoStore = require('connect-mongo')(session);
var cof=require(path.join(__dirname,"config.js"));
var app=express();
app.use(favicon());
app.set("views",path.join(__dirname,"views")); //设置模板的存放目录
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');                 //设置模板引擎是ejs
app.use("/public",express.static("public"));    

app.set("port",cof.portNum);   

// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: true,limit:2*1024*1024 }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    name:"testapp",
    secret:"CCM_TEST_NUM",
    cookie:{maxAge:24*60*60*1000},
    store: new MongoStore({url: cof.DBurl})
}));

require("./routes/router")(app);

const IP=os.networkInterfaces().en0[1].address;

mongoose.connect(cof.DBurl,function(err){
     if(err){
         console.log(err);
     }else{
         app.listen(app.get("port"),function(err){
             if(err){
                 console.log(err);
             }else{
                 console.log("数据库---服务器---启动成功!","IP地址是：",IP,"端口是：",cof.portNum);
             }
         });
     }
});

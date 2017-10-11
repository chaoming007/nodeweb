/**
 * Created by chencm on 2016/10/31.
 */
var mongoose=require("mongoose");
/* 用户表 */
//var dat=new Date();
//var tim=dat.getFullYear()+"-"+dat.getMonth()+"-"+dat.getDate();
var art=new mongoose.Schema({
    title:String,                      //文章标题
    time:{type:String,default:Date.now},       //发布时间
    author:{type:String,default:"网站发布"},  //发布作者
    source:{type:String,default:"网站发布"}, //文章来源
    link:String,                            //文章存储链接地址
    newclass:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"sorttabs"
    },                                    //文章分类
    keyword:String,                   //关键词
    content:String,                   //文章内容
    show:{type:Number,default:1},      //文章是否显示
    looknum:{type:Number,default:0},                     //文章浏览数
    commentnum:{type:Number,default:0},                  //文章评论数
    supportnum:{type:Number,default:0},                  //支持数
    opposenum:{type:Number,default:0},                   //反对数
    newImg:String                                   //新闻缩列图地址
});
var news=mongoose.model("newstab",art);

/*

 var s=new news({
         title:"全国人大任免国家安全部、民政部、财政部部长",
         time:"2016-11-07 09:37:32",
         author:"网易新闻",
         source:"网易新闻",
         link:"http://news.163.com/16/1107/09/C58RA81U0001899N.html",
         newclass:"军事",
         keyword:"新闻，政治，国家",
         content:"1968年至1978年南海舰队4009部队战士，首钢总控室、北京自动化研究所工人。1978年至1984年先后在清华大学、中国社会科学院研究生院学习。1984年至1988年历任国务院办公厅调研室财金组主任科员、副组长（副处级），中国社会科学院财经物资经济研究所成本价格室主任（正处级）。1988年至1995年历任上海市经济体制改革办公室副主任（副局级），国家体改委宏观调控体制司司长。1995年9月至1998年3月任贵州省副省长。1998年3月至2007年2月任财政部副部长、党组副书记。2007年2月至9月，任国务院副秘书长（正部长级）、机关党组成员兼国家外汇投资公司筹备组组长。2007年9月至2008年7月任中国投资有限责任公司党委书记、董事长兼首席执行官。2008年7月至2013年3月任中国投资有限责任公司党委书记、董事长兼首席执行官，中央汇金投资有限责任公司党委书记、董事长。2013年3月任财政部部长、党组书记。中共第十七届中央委员会候补委员、第十八届中央委员会委员，中共第十六届中央纪律检查委员会委员。",
         show:1,
         looknum:20,
         commentnum:100,
         supportnum:30,
         opposenum:50

 });
 s.save();

*/

module.exports=news;










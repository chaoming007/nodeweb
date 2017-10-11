/**
 * Created by chencm on 2016/11/2.
 */

var crypto = require('crypto');
var tools={};
var cooknum="CONT_CCM_NUM";


/*分页函数*/
/*
 *   pagenum:  当前页数，limitNum:每页显示条数，countNum:数据总数
 */

function pageFun(pagenum,limitNum,countNum){
	var page={};
    var pagenum=pagenum||1;	
	var skipNum=pagenum*limitNum-limitNum;
	var nextPage=parseInt(pagenum)+1;
	var prevPage=parseInt(pagenum)-1;
	var pages=Math.ceil(countNum/limitNum);   //总页数
    var pageinfo=false;
    if(countNum<=0){
    	pageinfo=true;
    }
	if(pagenum>pages || pagenum<1 || isNaN(pagenum)){ pageinfo=true;}
    prevPage=Math.max(1,prevPage);           //上一页
	nextPage=Math.min(pages,nextPage);       //下一页
    limitNum=limitNum>countNum?countNum:limitNum;
    page.nextPage=nextPage;		//上一页
	page.prevPage=prevPage;     //下一页
	page.counts=countNum;       //数据总数
	page.limitNum=limitNum;		//每页显示的数据条数
	page.pageNum=pages;			//总页数
	page.currentPage=pagenum;   //当前页数
	page.pageinfo=pageinfo;     //页码是否错误，是否有数据
	page.skipNum=skipNum;       //跳过的数据条数
   
	return  page;							
}

/*  时间格式化函数  */

function timFormatFun(tim){       //传入的时间
	var timeval=new Date(tim);
	timeval=timeval.getFullYear()+"-"+(timeval.getMonth()+1)+"-"+timeval.getDate()+"("+timeval.getHours()+":"+timeval.getMinutes()+":"+timeval.getSeconds()+")";
	return timeval;
}

/* 年月日 */

function yearFormatFun(tim){
	var date=new Date(tim);
	date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
	return date;
}



/*过滤html字符*/
function filterHtml(str){
	var str=(typeof str!=String)?String(str):str;
	str=str.replace(/<[^>]+>/g,'');
	return str;
}
/*匹配所有图片*/
function  searchImg(dat){
	var reg=/src=[\'\"]?([^\'\"]*)[\'\"]?/ig;
	var arr=dat.match(reg);
	return arr;
}
/*字符串截取*/
function conduct(obj,num){
	var str=(typeof obj!=String)?String(obj):obj;
	str=cutStrFun(str,num);
	return str;
	function cutStrFun(str,len){
		var strlen=0;
		var s="";
		for(var i= 0,leng=str.length;i<leng;i++){
			s=s+str.charAt(i);
			if(str.charCodeAt(i)>128){
				strlen=strlen+2;
			}else{
				strlen=strlen+1;
			}
			if(strlen>len){
				return s.substring(0, s.length-2)+"...";
			}
		}                                                                                                                                                                                                                                                                                                                
		return s;
	}
}

function encrypt(str,secret) {
	var cipher = crypto.createCipher('aes192', secret);
	var enc = cipher.update(str,'utf8','hex');
	enc += cipher.final('hex');
	return enc;
}
function decrypt(str,secret) {
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(str,'hex','utf8');
	dec += decipher.final('utf8');
	return dec;
}


tools={
	pageFun:pageFun,
	timFormatFun:timFormatFun,
	yearFormatFun:yearFormatFun,
	conduct:conduct,
	filterHtml:filterHtml,
	searchImg:searchImg,
	encrypt:encrypt,
	decrypt:decrypt,
	cooknum:cooknum
}

module.exports=tools;





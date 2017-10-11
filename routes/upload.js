/**
 * Created by chencm on 2016/10/26.
 */
var express=require("express");
var formidable = require('formidable');
var router=express.Router();

module.exports=function(req,res,next) {
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir ='/public/upload';
	form.parse(req, function (err, fields, files) {
		if (err) {throw err;}
		var image = files.imgFile;
		var path = image.path;
		path = path.replace(/\\/g, '/');
		var url = '/public/upload' + path.substr(path.lastIndexOf('/'), path.length);
		var info = {"error": 0, "url": url};
		res.json(info);
	});
}




     
















module.exports = router;

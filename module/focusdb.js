var mongoose=require("mongoose");
var focus=new mongoose.Schema({
	  src:{
	  	type:String,
	  	default:""
	  },
	  title:{
	  	type:String,
	  	default:""
	  },
	  show:{
	  	type:Number,
	  	default:1
	  },
	  link:{
	  	type:String,
	  	default:""
	  }

});

var focus=mongoose.model("focus",focus);

module.exports=focus;

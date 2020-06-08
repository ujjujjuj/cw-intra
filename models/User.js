const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true,
		max:255
    },
	name:{
		type:String,
		required:true,
		max:255
	},
	email:{
		type:String,
		required:true,
		max:1024
	},
	password:{
		type:String,
		required:true,
		max:255
	},
	isVK:{
		type:Boolean,
		required:true,
	},
	lastAnswer:{
		type:Date,
		default:new Date().getTime()
	},
	isBanned:{
		type:Boolean,
		default:false
	},
    ip:{
		type:String,
		required:true,
		max:255
	},
	level:{
		type:Number,
		default:0,
    },
	date:{
		type:Date,
		default:new Date().getTime() + 1000*60*60*5.5
	}
});

module.exports = mongoose.model("User",userSchema);
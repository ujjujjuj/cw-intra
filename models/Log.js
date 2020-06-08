const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true
    },
    level:{
        type:Number,
        required:true
    },
	input:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:new Date().getTime() + 1000*60*60*5.5
    }
});

module.exports = mongoose.model("Log",logSchema);
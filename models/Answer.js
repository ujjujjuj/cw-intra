const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
	level:{
		type:Number,
		required:true
    },
	answer:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Answer",answerSchema);
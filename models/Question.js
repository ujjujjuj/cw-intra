const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	level:{
		type:Number,
		required:true
    },
	title:{
		type:String,
		required:true,
		max:255
	},
	text:{
		type:Object,
		required:true,
		max:1024
	},
	extra:{
        type:Object,
        default:[],
		max:255
	}
});

module.exports = mongoose.model("Question",questionSchema);
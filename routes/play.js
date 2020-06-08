const router = require("express").Router();
const User = require("../models/User.js");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const Log = require("../models/Log.js");
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require('path');

router.get("/play",(req,res) => {

    //check if already logged in
    if(req.cookies['auth']==null){
        return res.redirect("/techathlon/login");
    };

    res.render(path.join(__dirname + '/../views/play.ejs'),{
        title:"Question1",
        content:"This is the first question",
        extra:{
            "comment":"this is a comment",
            "title":"MMMM"
        }
    });

});

router.post("/play",async (req,res) => {

    //check if already logged in
    if(req.cookies['auth']==null){
        return res.redirect("/techathlon/login");
    };

    token = req.cookies['auth'];

    //get id from jwt
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.status(404).send("404 page not found");	
		}
        uid = authData;
    });
    const user = await User.findOne({_id: uid});
    
    //hash user ans
    hashedAns = crypto.createHash('sha256').update(req.body.answer).digest('hex');

    //get ans from db
    answer = await Answer.findOne({level:user.level});

    if(!(hashedAns == answer.answer)){
        
        //save log
        const log = new Log({
            username:user.username,
            level:user.level,
            input:req.body.answer,
            status:"Incorrect"
        });
        const savedLog = await log.save();

        return res.send("Incorrect");
    }

    const log = new Log({
        username:user.username,
        level:user.level,
        input:req.body.answer,
        status:"Correct"
    });
    const savedLog = await log.save();

    user.level += 1;
    user.lastAnswer = new Date().getTime() + 1000*60*60*5.5;

    const savedUser = await user.save();

    res.redirect("/play");

});

module.exports=router;
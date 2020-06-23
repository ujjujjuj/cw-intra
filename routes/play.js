const router = require("express").Router();
const User = require("../models/User.js");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const Log = require("../models/Log.js");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const path = require('path');

router.get("/play", (req,res) => {
    return res.sendFile(path.join(__dirname + '/../views/playBefore.html'));
});
/*
router.get("/play",async (req,res) => {

    //check if already logged in
    if(req.cookies['auth']==null){
        return res.redirect("/techathlon/login");
    };

    //get user level
    let token = req.cookies['auth'];
    let uid;

    //get id from jwt
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));	
		}
        uid = authData;
    });
    const user = await User.findById(uid);
    if(user.isBanned){
        return res.send("banned");
    }

    //get level info
    const levelInfo = await Question.findOne({"level":user.level});
    return res.render(path.join(__dirname + '/../views/play.ejs'),levelInfo)

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
			return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));	
		}
        uid = authData;
    });
    const user = await User.findOne({_id: uid});
    
    //normalise and hash user ans
    let normalisedAns = req.body.answer.replace(/ /g,'').toLowerCase()
    hashedAns = crypto.createHash('sha256').update(normalisedAns).digest('hex');

    //get ans from db
    answer = await Answer.findOne({level:user.level});

    //if answer is incorrect
    if(!(hashedAns == answer.answer)){
        
        //save log
        const log = new Log({
            username:user.username,
            level:user.level,
            input:req.body.answer,
            status:"Incorrect"
        });
        const savedLog = await log.save();

        //get level info and send error
        const levelInfo = await Question.findOne({"level":user.level});
        levelInfo.error = "ys";
        return res.render(path.join(__dirname + '/../views/play.ejs'),levelInfo);
    }

    //if answer is correct
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

    res.redirect("/techathlon/play");

});
*/
module.exports=router;
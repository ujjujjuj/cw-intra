const router = require("express").Router();
const User = require("../models/User.js");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const Log = require("../models/Log.js");
const path = require('path');
const jwt = require("jsonwebtoken");

//All logs
router.get("/logs/",async (req,res) => {

    if(req.cookies['auth']==null){
        return res.status(404).send("404 page not found");
    };

    let token = req.cookies['auth'];
    let uid;

    //get id from jwt
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.status(404).send("404 page not found");	
		}
        uid = authData;
    });
    const user = await User.findById(uid);

    //check if user isnt admin or not
    if(user.username != process.env.ADMIN_USER){
        return res.status(404).send("404 page not found");
    }

    //get logs and order them
    const logs = await Log.find({},null,{limit:100});

    out = []
    for(i=0;i<logs.length;i++){
        out.push({
            name:logs[i].username,
            input:logs[i].input,
            level:logs[i].level,
            status:logs[i].status,
            date:logs[i].time.toISOString().replace(/T/, ' ').replace(/\..+/, '')
        });
    }
    res.render(path.join(__dirname + '/../views/log.ejs'),{logs:out})
    
});


//User specific logs
router.get("/logs/:username",async (req,res) => {

    if(req.cookies['auth']==null){
        return res.status(404).send("404 page not found");
    };

    let token = req.cookies['auth'];
    let uid;

    //get id from jwt
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.status(404).send("404 page not found");
		}
        uid = authData;
    });
    const user = await User.findById(uid);

    //check if user isnt admin or not
    if(user.username != process.env.ADMIN_USER){
        return res.status(404).send("404 page not found");
    }

    //get logs and order them
    const logs = await Log.find({username:req.params.username},null,{limit:100});

    out = []
    for(i=0;i<logs.length;i++){
        out.push({
            name:logs[i].username,
            input:logs[i].input,
            level:logs[i].level,
            status:logs[i].status,
            date:logs[i].time.toISOString().replace(/T/, ' ').replace(/\..+/, '')
        });
    }
    res.render(path.join(__dirname + '/../views/log.ejs'),{logs:out})

});

router.get("/info/:username", async (req,res) =>{

    if(req.cookies['auth']==null){
        return res.status(404).send("404 page not found");
    };

    let token = req.cookies['auth'];
    let uid;

    //get id from jwt
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.status(404).send("404 page not found");
		}
        uid = authData;
    });
    const Adminuser = await User.findById(uid);

    //check if user isnt admin or not
    if(Adminuser.username != process.env.ADMIN_USER){
        return res.status(404).send("404 page not found");
    }

    let username = req.params.username;
    console.log(username)
    let user = await User.findOne({"username":username});

    res.setHeader('Content-Type', 'application/json');
    console.log(user)

    if(!user){
        return res.send({"error":"User does not exist"});
    }
    
    res.send({
        name:user.name,
        username:user.username,
        email:user.email,
        level:user.level,
        isBanned:user.isBanned,
        Class:user.section,
        Registration:user.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        ip:user.ip,
        lastAnswer:user.lastAnswer.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    });

});

router.get("/addanswer", async (req,res) =>{

    const answer = new Answer({
        level:0,
        answer:"1ef128f5e74f227d60fd632d3574fe72618dbebfeb35266d84ffe58f0ea4f171",
    });
    const savedAns = await answer.save();

    res.send("adding");

});

module.exports=router;
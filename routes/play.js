const router = require("express").Router();
const User = require("../models/User.js");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const Log = require("../models/Log.js");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const path = require('path');

//set up mailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
});

/*
router.get("/play", (req,res) => {
    return res.sendFile(path.join(__dirname + '/../views/playBefore.html'));
});
*/

//level 6 (constellation)
function level6(email){
    let mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Techathlon",
        text: 'congratulation',
        attachments: [{
            filename: 'hmmmm.png',
            path: __dirname +"/../public/images/lvl6num.ailfh13.png",
            cid: 'num'
       }]
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
router.get("/play/cygnus",async (req,res) => {

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
    if(!user){
        res.redirect("/techathlon/logout");
    }
    if(user.level != 6){
        return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));
    }
    return res.sendFile(path.resolve(__dirname + "/../public/images/cygnus.oh3doi.png"));
});

//level 3 (bill gates)
router.get("/play/leveltrey",async (req,res) => {

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
    if(!user){
        res.redirect("/techathlon/logout");
    }
    if(user.level != 3){
        return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));
    }
    return res.send("The Toast Derivation");
});

//ping pong level
router.get("/play/pong",async (req,res) => {

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
    if(!user){
        res.redirect("/techathlon/logout");
    }
    if(user.level != 7){
        return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));
    }
    return res.sendFile(path.join(__dirname + '/../views/pong.html'));
});

//LEVEL STUFF
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
    if(!user){
        res.redirect("/techathlon/logout");
    }
    if(user.isBanned){
        return res.send("banned");
    }
    //testing
     if(user.username != process.env.ADMIN_USER){
        return res.sendFile(path.join(__dirname + '/../views/playBefore.html'));
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

    //testing
    if(user.username != process.env.ADMIN_USER){
        return res.status(404).sendFile(path.join(__dirname + '/../views/playBefore.html'));
    } 
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
            input:normalisedAns,
            status:"Incorrect"
        });
        await log.save();

        //get level info and send error
        const levelInfo = await Question.findOne({"level":user.level});
        levelInfo.error = "ys";
        return res.render(path.join(__dirname + '/../views/play.ejs'),levelInfo);
    }

    //if answer is correct
    const log = new Log({
        username:user.username,
        level:user.level,
        input:normalisedAns,
        status:"Correct"
    });
    await log.save();

    user.level += 1;
    user.lastAnswer = new Date().getTime() + 1000*60*60*5.5;

    //email lvl
    if(user.level == 6){
        level6(user.email);
    } 
    const savedUser = await user.save();

    res.redirect("/techathlon/play");

});

module.exports=router;
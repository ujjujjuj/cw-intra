const router = require("express").Router();
const User = require("../models/User.js");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const Log = require("../models/Log.js");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const path = require('path');

//nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
});

//level 8 (email+constellation)
function level8(email){
    let mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Techathlon",
        text: 'congratulation',
        attachments: [{
            filename: 'hmmmm.png',
            path: __dirname +"/../public/images/cygnum.sdfuiohfuo2.png",
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
    if(user.level != 8){
        return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));
    }
    return res.sendFile(path.resolve(__dirname + "/../public/images/cygnus.oh3doi.png"));
});

//level 3 (trey)
router.get("/play/level3",async (req,res) => {

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
    if(user.level != 3){
        return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));
    }
    //get level info
    const levelInfo = await Question.findOne({"level":3});
    return res.render(path.join(__dirname + '/../views/play.ejs'),levelInfo)

});
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

//level 7 (pong)
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
    if(req.cookies["pong"]){
        if(req.cookies["pong"] == "vedantaneogirandi"){
            return res.status(404).sendFile(path.join(__dirname + '/../views/404.html'));
        }
    }
    return res.sendFile(path.join(__dirname + '/../views/pong.html'));
});

/***********************************LEVEL**********************************/
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
    //level 3(trey)
    if(user.level == 3){
        return res.redirect("/techathlon/play/level3")
    }

    //level 7(pong)
    if(user.level == 7){
        if(!req.cookies["pong"]){
            return res.redirect("/techathlon/play/pong");
        }
        if(!(req.cookies["pong"] == "vedantaneogirandi")){
            return res.redirect("/techathlon/play/pong");
        }
    }

    //win
    if(user.level == 10){
        return res.send("congratulation");
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
    normalisedAns = normalisedAns.replace(/’/g,"'"); //lvl0 quote fix
    if(normalisedAns.length > 45){
        const log = new Log({
            username:user.username,
            level:user.level,
            input:normalisedAns.substring(0,30)+"...",
            time:Date.now() + 1000*60*60*5.5,
            status:"Incorrect"
        });
        await log.save();
        //get level info and send error
        const levelInfo = await Question.findOne({"level":user.level});
        levelInfo.error = "ys";
        return res.render(path.join(__dirname + '/../views/play.ejs'),levelInfo);
    }
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
            time:Date.now() + 1000*60*60*5.5,
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
        time:Date.now() + 1000*60*60*5.5,
        status:"Correct"
    });
    await log.save();

    user.level += 1;
    user.lastAnswer = new Date().getTime() + 1000*60*60*5.5;

    //email lvl
    if(user.level == 8){
        level8(user.email);
    } 
    await user.save();
    
    res.redirect("/techathlon/play");

});

module.exports=router;
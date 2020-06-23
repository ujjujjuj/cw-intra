const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const request = require('request');

//registration
router.get("/register",(req,res) => {

    //check if already logged in
    if(req.cookies['auth']!=null){
        return res.redirect("/techathlon");
    };

    res.render(path.join(__dirname + '/../views/register.ejs'),{error:[]});
});

router.post("/register",async (req,res) => {

    //recaptcha
    err=false;
    let respToken = req.body["g-recaptcha-response"];
    request.post(
        'https://www.google.com/recaptcha/api/siteverify',
        { formData: { secret: '6LdR_QAVAAAAAJBZRSQwYxuAtXpc2B7sFvyeZsGj' ,response:respToken} },
        function (error, response, body) {
            if(error){
                err = true;
                return res.render(path.join(__dirname + '/../views/register.ejs'),{error:["auth"]});
            }
            if(!JSON.parse(body).success){
                err = "true"
                return res.render(path.join(__dirname + '/../views/register.ejs'),{error:["auth"]});
            }
        }
    );
    if(err){
        return
    }

    //instantiate variables
    let username = req.body.username;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let isVK;
    let section;
    if(req.body.isVK == "Yes"){
        isVK = true;
        section = req.body.section;
    }else{
        isVK = false;
        section = "NA";
    }
    let ip = req.ip

    if(username.length < 4 || password.length <6){
        return res.send("no");
    }

    //check if email/user exists
    const emailExists = await User.findOne({email:req.body.email});
    const userExists = await User.findOne({username:req.body.username});

    if(userExists){
		return res.render(path.join(__dirname + '/../views/register.ejs'),{error:["username"]});
	}
	if(emailExists){
		return res.render(path.join(__dirname + '/../views/register.ejs'),{error:["email"]});
    }
    
    const ipAccounts = await User.find({ip:ip});
    if(ipAccounts.length > 10){
        return res.render(path.join(__dirname + '/../views/register.ejs'),{error:["auth"]});
    }

    //pass hash+salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    
    //saving the user to the db
    const user = new User({
        name:name,
        username:username,
		email:email,
        password:hashedPassword,
        isVK:isVK,
        ip:ip
    });

    //saving to db
	try{
		const savedUser = await user.save();
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
        res.cookie("auth",token,{maxAge:2*24*60*60*1000});
		return res.redirect("/techathlon");
	}catch(err){
        console.log(err);
        return res.send("An unexpected error occured");  
	}
});

//login
router.get("/login",(req,res) => {

    //check if already logged in
    if(req.cookies['auth']!=null){
        return res.redirect("/techathlon");
    };

    res.render(path.join(__dirname + '/../views/login.ejs'),{error:[]});
});

router.post("/login",async (req,res) => {
    
    //recaptcha
    let respToken = req.body["g-recaptcha-response"];
    const secret_key = "6LdR_QAVAAAAAJBZRSQwYxuAtXpc2B7sFvyeZsGj"
    err = false;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${respToken}`;
    request.post(url,function (error, response, body) {
        console.log(body)
        if(error){
            err = true;
            return res.render(path.join(__dirname + '/../views/login.ejs'),{error:["auth"]});
        }
        if(!JSON.parse(body).success){
            err = "true"
            return res.render(path.join(__dirname + '/../views/login.ejs'),{error:["auth"]});
        }
        }
    );
    if(err){
        return
    }

    //instantiate variables
    let username = req.body.username;
    let password = req.body.password;

    if(username.length < 4 || password.length <6){
        return res.send("no");
    }

    //check if username exists
    const user = await User.findOne({username:username});
	if(!user){
        return res.render(path.join(__dirname + '/../views/login.ejs'),{error:["username"]});
	}
    //check password
	const validPass = await bcrypt.compare(password, user.password);
	if(!validPass){
		return res.render(path.join(__dirname + '/../views/login.ejs'),{error:["password"]});
    }
    
    //create token and set cookie
	const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.cookie("auth",token,{maxAge:2*24*60*60*1000});
	return res.redirect("/techathlon");
});

router.get("/logout", (req,res) => {
    res.cookie("auth","goodbye",{expires: new Date()});
    res.redirect("/techathlon");
});

module.exports=router;
const router = require("express").Router();
const User = require("../models/User.js");
const path = require('path');
const jwt = require("jsonwebtoken");

router.get("/",async (req,res) => {

    //check if already logged in
    if(req.cookies['auth']==null){
        return res.redirect("/techathlon/register");
    };
    //get username
    token = req.cookies['auth'];
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.redirect("/techathlon/logout");	
		}
        uid = authData;
    });
    const user = await User.findOne({_id: uid});
    if(!user){
        res.redirect("/techathlon/logout");
    }
    res.render(path.join(__dirname + '/../views/about.ejs'),{"username":user.username});
});

router.get("/leaderboard", async (req,res) => {

    //dynamic leaderboard
    /* 
    
    //querying data
    data = await User.find({},"username level isVK").sort({level:"descending",lastAnswer:"ascending"});

    //removing _id
    leaderboard = []
    cnt = 1
    for(let i=0;i < data.length;i++){

        //remove kevin
        if(data[i].username == "Kevin"){
            continue;
        }
        
        //check if user is from VK
        let username;
        if(!data[i].isVK){
            username = data[i].username+"(NC)";
        }else{
            username = data[i].username;
        }
        if(data[i].level==42){
            leaderboard.unshift({"rank":"hm","username":username,"level":42});
        }else{
            if(data[i].level==10){
                leaderboard.push({"rank":cnt,"username":username,"level":"GG"});
            }else{
                leaderboard.push({"rank":cnt,"username":username,"level":data[i].level});
            }          
            cnt += 1
        }
    } 

    res.render(path.join(__dirname + '/../views/leaderboard.ejs'),{"leaderboard":leaderboard});
    */

    //static leaderboard
    res.sendFile(path.join(__dirname + '/../views/finalLeaderboard.html'));
});

module.exports=router;
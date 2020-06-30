const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const path = require('path');

//environment variables
const dotenv = require("dotenv");
dotenv.config();

//app init + middleware
app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const port = process.env.PORT || 8080;

//db config and init
const config = {
	useUnifiedTopology: true,
  	useNewUrlParser: true
}
mongoose.connect(process.env.DB_URL,config,function(){
    console.log("Connected to db")
});
    
// **********************ROUTES*********************

// INTRA LANDING
app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

// TECHATHLON 

// --auth--
const authRoute = require("./routes/auth");
app.use("/techathlon",authRoute);

// --landing and leaderboard--
const miscRoute = require("./routes/misc");
app.use("/techathlon",miscRoute);

// --play--
const playRoute = require("./routes/play");
app.use("/techathlon",playRoute);

// --admin stuff--
const adminRoute = require("./routes/admin");
app.use("/techathlon/admin",adminRoute);

//404
app.get('*', function(req, res){
    res.status(404).sendFile(path.join(__dirname + '/views/404.html'));
});

//server init
app.listen(port,() => {
    console.log("Listening on port "+port);
});
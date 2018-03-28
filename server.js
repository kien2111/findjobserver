var express = require('express');
var app = express();
var morgan = require('morgan');
var dotenv = require('dotenv').config();
var fs = require('fs');
var path = require('path');
var bodyparser = require('body-parser');
var cookiParser = require('cookie-parser')();
var rfs = require('rotating-file-stream')
var logDirectory = path.join(__dirname, 'log');
var jwt = require('jsonwebtoken');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var logStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
});
app.listen(process.env.PORTSERVER,()=>{
    console.log("Server is ready");
});
app.use(morgan('combined',{stream:logStream}));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookiParser);
app.use('/Accounts',require('./router/accountRoute'));
app.use('/Categories',require('./router/categoryRoute'));
app.use('/Profiles',require('./router/profileRoute'));
app.use('/Admins',require('./router/adminRoute'));
app.use('/Images',require('./router/imageRoute'));
app.use('/Rates',require('./router/rateRoute'));
app.use('/Users',require('./router/userRoute'));
app.use(function(req,res,next){
    
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]==='bearer'){
        jwt.verify(req.headers.authorization.split(' ')[1],process.env.SECRET_KEY,function(err,decoded){
            if(err)req.user = undefined;
            req.user = decoded;
            next();
        });
    }else{
        req.user = undefined;
        next();
    }
});

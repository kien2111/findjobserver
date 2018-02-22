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
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var logStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
});
app.listen();
app.use(morgan('combined',{stream:logStream}));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookiParser);

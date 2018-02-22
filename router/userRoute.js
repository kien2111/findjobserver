var express = require('express');
var router = express.Router();
var usercontroller = require('../controller/userController');
router.use((next,req,resp)=>{
    next();
});

router.post('/login',);
router.post('/signup');
'use strict';
var express = require('express');
var router = express.Router();
var controller = require('../controller/accountController');
router.use((req,res,next)=>{
    next();
});

router.post('/Login',controller.Login);
router.post('/SignUp',controller.SignUp);
router.get('/test',controller.loginRequired,controller.test);
module.exports = router;
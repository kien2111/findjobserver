'use strict';
var express = require('express');
var router = express.Router();
var controller = require('../controller/profileController');
var usercontroller = require('../controller/userController');
router.use((req,res,next)=>{
    next();
});

router.get('/getprofile',controller.getProfile);
router.get('/search',controller.search);
module.exports = router;
'use strict';
var express = require('express');
var router = express.Router();
var controller = require('../controller/profileController');
var accountcontroller = require('../controller/accountController');
router.use((req,res,next)=>{
    next();
});

router.get('/gethighrateprofile',controller.getHighRateProfile);
module.exports = router;
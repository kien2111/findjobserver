'use strict';
var express = require('express');
var router = express.Router();
var controller = require('../controller/categoryController');
var accountcontroller = require('../controller/accountController');
router.use((req,res,next)=>{
    next();
});

router.get('/GetAllCategories',accountcontroller.loginRequired,controller.getAllCategories);
module.exports = router;
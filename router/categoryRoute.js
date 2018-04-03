'use strict';
var express = require('express');
var router = express.Router();
var controller = require('../controller/categoryController');
var usercontroller = require('../controller/userController');
router.use((req,res,next)=>{
    next();
});

router.get('/GetAllCategories',controller.getAllCategories);
module.exports = router;
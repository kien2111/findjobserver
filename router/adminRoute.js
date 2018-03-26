var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController');
router.use((req,res,next)=>{
    next();
});
router.get('/fetchuser',adminController.getAllUser);
module.exports = router;
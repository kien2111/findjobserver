var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController');
router.use((req,res,next)=>{
    next();
});
router.get('/fetchuser',adminController.getAllUser);
router.delete('/deleteuser',adminController.deleteUser);
router.post('/insertuser',adminController.insertuser);
module.exports = router;
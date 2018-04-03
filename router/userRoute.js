var express = require('express');
var router = express.Router();
var controller = require('../controller/userController');
module.exports = router;

router.get('/getdetailprofile',controller.getdetailprofile);
router.post('/Login',controller.Login);
router.post('/SignUp',controller.SignUp);

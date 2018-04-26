var express = require('express');
var router = express.Router();
var controller = require('../controller/rateController');
module.exports = router;
router.post('/ratefreelancer',controller.ratefreelancer);
router.get('/getlistrate',controller.getlistrate);

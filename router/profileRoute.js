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
router.put('/dotaskpublishprofile',controller.doTaskPublishProfile);
router.post('/upgradeprofile',controller.doTaskUpgradeProfile);
router.get('/getallpakageupgrade',controller.getListPakageUpgrade);
router.get('/getlastestrequestupgrade',controller.getLastestProcessRequest);
router.get('/fetchdetaiprofilewithid',controller.fetchDetaiProfileWithId);
router.delete('/deletelastestupgraderequest',controller.deleteLastestUpgradeRequest);
router.get('/getmapprofile',controller.getMapProfile);
module.exports = router;
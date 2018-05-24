var express = require('express');
var router = express.Router();
var controller = require('../controller/userController');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({storage:storage});

module.exports = router;
router.get('/getdetailprofile',controller.getdetailprofile);
router.get('/getaveragedetail',controller.getAverageRateProfile);
router.post('/Login',controller.Login);
router.post('/SignUp',controller.SignUp);
router.get('/Test',controller.loginRequired,controller.isUserBlocked);
router.put('/updateprofile',upload.fields([{name:'avatar',maxCount:1},{name:'logo',maxCount:1}]),controller.updateProfile);
router.put('/updateprofilewithoutimage',controller.updateProfileWithoutImage);
router.get('/fetchtableexchange',controller.fetchTableExchange);
router.get('/syncdata',controller.SyncData);
router.get('/fetchremoteuserdata',controller.fetchRemoteUserData);
router.put('/topupmoney',controller.topUpMoney);

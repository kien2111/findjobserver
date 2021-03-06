var express = require('express');
var router = express.Router();
var multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'image/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
var upload = multer({ storage: storage});
var adminController = require('../controller/adminController');
var controller = require('../controller/profileController');
var appointmentController= require('../controller/appointmentController');

router.use((req,res,next)=>{
    next();
});
router.get('/fetchuser',adminController.getAllUser);
router.delete('/deleteuser',adminController.deleteUser);
router.post('/insertuser',upload.single('avatar'),adminController.insertuser);
router.post('/updateuser',adminController.updateuser);
router.post('/blockuser',adminController.blockuser);
router.get('/getallprofile',controller.getAllProfile);
router.post('/blockprofile',controller.blockprofile);
router.post('/getuserblock',adminController.getAllUserBlock);
router.get('/getallstatisfy',adminController.getAllStatisfy);
router.get('/getallappointment',appointmentController.fetchAllWaitAppointment);
router.post('/acceptAppointment',appointmentController.acceptAppointmentAdmin)
router.post('/skipAppointment',appointmentController.skipAppointment)
router.get('/getallupgradeaccount',adminController.getAllUpgradeAccount)
router.post('/acceptallrequestupgradeprofile',adminController.acceptAllRequestUpgrade);
router.get('/fetchlastestrevenuepermonth',adminController.fetchLastestRevenuePerMonth);
router.get('/fetchlastestrevenueperyear',adminController.fetchLastestRevenuePerYear);
router.get('/fetchlastestrevenueperday',adminController.fetchLastestFiveDayRevenue);
router.get('/:option/fetchrevenue',adminController.fetchRevenue);
router.get('/getallonprogressrequest',adminController.getAllOnProgressRequest);
router.post('/acceptupgradeprofile',adminController.acceptUpgradeProfile);
module.exports = router;
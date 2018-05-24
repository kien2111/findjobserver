var express = require('express');
var router = express.Router();
var controller = require('../controller/appointmentController');
module.exports = router;
const routeApi =function(req,res,next){
    if(!req.params.option)res.status(403).json({message:"not supply option",data:null});
    else{
        chooseOption(req.params.option,req,res);
    }
}
router.get('/:option/getlistappointment',routeApi);
router.get('/getdepositfee',controller.getAvailableDepositFee);
router.post('/bookingappointment',controller.bookingAppointment);
router.put('/acceptappointment',controller.acceptAppointment);
router.put('/declineappointment',controller.declineAppointment);

const chooseOption = function(option,req,res){
    if(defineOption.freelancer.compareOption(option)){
        defineOption.freelancer.getHandleFunction(req,res);
    }else if(defineOption.employer.compareOption(option)){
        defineOption.employer.getHandleFunction(req,res);
    }
}

const defineOption ={
    freelancer:{
        option:1,
        compareOption:function(option){
            return this.option==option;
        },
        getHandleFunction(req,res){
            return controller.fetchFreelancerAppointment(req,res);
        }
    },
    employer:{
        option:2,
        compareOption:function(option){
            return this.option==option;
        },
        getHandleFunction(req,res){
            return controller.fetchOnEmployerAppointment(req,res);
        }
    }
}
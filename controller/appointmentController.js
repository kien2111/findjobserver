var _ = require('lodash');
var {AppointmentModel} = require('../model/appointmentModel');
var {Deposit_FeeModel} = require('../model/deposit_feeModel');
exports.fetchFreelancerAppointment = function(req,res){
    AppointmentModel.fetchFreelancerAppointment(req.query)
    .tap(console.log)
    .then(result=>{
        pagination = result.pagination;
        res.status(200).json({message:"fetch OK",data:{
            iduser:req.query.iduser,
            option:req.params.option,
            totalcount:pagination.rowCount,
            historyOrOnProgress:req.query.historyOrOnProgress,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            appointments:result.toJSON()
        }});
    })
    .catch(console.log)
    .catch(err=>{
        res.status(403).json({message:err.message,data:null});
    });
}

exports.fetchOnEmployerAppointment = function(req,res){
    console.log(req.query);
    AppointmentModel.fetchEmployerAppointment(req.query)
    .tap(console.log)
    .then(result=>{
        pagination = result.pagination;
        res.status(200).json({message:"fetch OK",data:{
            iduser:req.query.iduser,
            option:req.params.option,
            totalcount:pagination.rowCount,
            historyOrOnProgress:req.query.historyOrOnProgress,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            appointments:result.toJSON()
        }});
    })
    .catch(err=>{
        res.status(403).json({message:err.message,data:null});
    });
}

exports.fetchAllWaitAppointment = function(req,res){
    AppointmentModel.fetchAllAppointment()
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"fetch OK",data:result});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            })
            .catch(console.log);
}
exports.acceptAppointment = function(req,res){
    AppointmentModel.acceptAppointment(req.body)
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"update OK",data:result});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            })
            .catch(console.log);
}
exports.skipAppointment = function(req,res){
    AppointmentModel.skipAppointment(req.body)
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"update OK",data:result});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            })
            .catch(console.log);
}
exports.getAvailableDepositFee = function(req,res){
    Deposit_FeeModel.getAvailableDepositFee()
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"fetch success",data:result.toJSON()});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            });
}

exports.bookingAppointment = function(req,res){
    AppointmentModel.bookingAppointment(req.body)
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"booking success",data:null});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            });
}
exports.acceptAppointment = function(req,res){
    console.log(req.body);
    AppointmentModel.acceptAppointment(req.body)
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"accept appointment success",data:null});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            });
}
exports.declineAppointment = function(req,res){
    console.log(req.body);
    AppointmentModel.declineAppointment(req.body)
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"decline appointment success",data:null});
            })
            .catch(err=>{
                console.log("go here");
                res.status(403).json({message:err.message,data:null});
            });
}
var _ = require('lodash');
var {AppointmentModel} = require('../model/appointmentModel');

exports.fetchOnProgressFreelancerAppointment = function(req,res){
    AppointmentModel.fetchOnProgressFreelancerAppointment(req.query)
    .tap(console.log)
    .then(result=>{
        pagination = result.pagination;
        res.status(200).json({message:"fetch OK",data:{
            iduser:req.query.iduser,
            option:req.params.option,
            totalcount:pagination.rowCount,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            appointments:result.toJSON()
        }});
    })
    .catch(console.log)
    .catch(err=>{
        res.status(403).json({message:err.message,data:null});
    });
}

exports.fetchOnProgressEmployerAppointment = function(req,res){
    AppointmentModel.fetchOnProgressEmployerAppointment(req.query)
    .tap(console.log)
    .then(result=>{
        pagination = result.pagination;
        res.status(200).json({message:"fetch OK",data:{
            iduser:req.query.iduser,
            option:req.params.option,
            totalcount:pagination.rowCount,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            appointments:result.toJSON()
        }});
    })
    .catch(console.log)
    .catch(err=>{
        res.status(403).json({message:err.message,data:null});
    });
}
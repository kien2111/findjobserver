var {RateModel} = require('../model/rateModel');
var _ = require('lodash');
exports.ratefreelancer = function(req,res){
    console.log(JSON.stringify(req.body));
    RateModel.doRate(req.body)
        .tap(console.log)
        .then(result=>{
            res.status(200).json({message:"Rate Success",data:null});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        })
}
exports.getlistrate = function(req,res){
    RateModel.getListRate(req.query)
        .tap(console.log)
        .then(result=>{
            pagination = result.pagination;
            res.status(200).json({message:"fetch OK",data:{
                query:req.query.iduser,
                totalcount:pagination.rowCount,
                nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
                rates:result.toJSON()
            }});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(301).json({message:err.message,data:null});
        })
}
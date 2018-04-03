var {RateModel} = require('../model/rateModel');

exports.ratefreelancer = function(req,res){
    RateModel.dorate(req.body)
        .then(console.log)
        .then(result=>{
            res.status(200).json({message:"Rate Success",data:null});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        })
}
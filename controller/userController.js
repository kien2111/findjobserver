var {UserModel,UserCollection} = require('../model/userModel');
exports.getdetailprofile = (req,res)=>{
    UserModel.getdetailprofile(req.query.iduser)
        .then(console.log)
        .then(result=>{
            res.status(200).json({message:"fetch OK",data:result.toJSON()});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        })
}
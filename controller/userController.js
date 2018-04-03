var {UserModel,UserCollection} = require('../model/userModel');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var Profile = require('../model/profileModel');
var {UserModel,UserCollection} = require('../model/userModel');
var {bookshelf} = require('../db/dbconnect');
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
exports.loginRequired=function(req,res,next){
    if(req.user){
        next();
    }else{
        return res.status(401).json({message:`Unauthorized user`,data:null});
    }
}
exports.Login = function(req,res){
    const {username,password,email} = req.body;
    UserModel.login(req.body).then(account=>{
        res.status(200).json({message:"Login OK",
        data:{user:account.omit(['password','access_token']),
        access_token:account.get('access_token'),
        auth_token_type:"Bearer"}
            });
    }).catch(UserModel.NotFoundError,()=>{
        res.status(400).json({message:"Can't found user pls SignUp",data:null});
    }).catch(err=>{
        console.log(err);
        res.status(400).json({message:err.message,data:null});
    })
}
exports.SignUp = function(req,res){
    var obj = req.body;
    UserModel.signup(obj).then(result=>{
        res.status(200).json({message:"Signup OK",data:null});
    })
    .then(console.log)
    .catch(console.log)
    .catch(err=>{
        res.status(400).json({message:err.message,data:null});
    })
    
}
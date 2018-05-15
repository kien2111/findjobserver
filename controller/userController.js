var {UserModel,UserCollection} = require('../model/userModel');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var Profile = require('../model/profileModel');
var {UserModel,UserCollection} = require('../model/userModel');
var {RateModel} = require('../model/rateModel');
var {bookshelf} = require('../db/dbconnect');
var {Table_ExchangeModel} = require('../model/table_exchangeModel');
var {CreditModel} = require('../model/creditModel');
var fs = require('fs');
exports.getdetailprofile = (req,res)=>{
    UserModel.getdetailprofile(req.query)
        .tap(console.log)
        .then(result=>{
            console.log(result);
            res.status(200).json({message:"fetch OK",data:clean(_.omit(result.toJSON(),
            ['phone_company','email','account_balance','phone_individual','password','username']))});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        })
}
function clean(obj) {
    for (var propName in obj) { 
        console.log(propName);
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
}
exports.getAverageRateProfile = (req,res)=>{
    RateModel.getAveragePoint(req.query).then(result=>{
        res.status(200).json({message:"fetch average OK",data:{
            average_point:result
        }})
    }).catch(console.log)
    .catch(err=>res.status(304).json({message:"there is something wrong",data:null}));
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
        auth_token_type:SupportAuth_Token_Type.Bearer}
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
exports.updateProfileWithoutImage = function(req,res){
    let prehandledata = omitSomeUserData(req.body);
    UserModel.updateProfile(prehandledata)
    .tap(console.log)
    .then(result=>{
        res.status(200).json({message:"update Ok",data:null});
    })
    .catch(console.log)
    .catch(err=>{
        res.status(403).json({message:"update profile Error : "+err.message,data:null});
    });
}
exports.updateProfile = function(req,res){
    let prehandledata = omitSomeUserData(req.body.user);
    let obj = JSON.parse(prehandledata);
    if(req.files['avatar'] && req.files['avatar'][0]){
        //avatar
        obj.avatar = req.files['avatar'][0].filename;
    }
    if(req.files['logo'] && req.files['logo'][0]){
        //logo company
        obj.logo_company = req.files['logo'][0].filename;
    }
    
    UserModel.updateProfile(obj)
    .tap(console.log)
    .then(result=>{
        res.status(200).json({message:"update Ok",data:null});
    })
    .catch(console.log)
    .catch(err=>{
        res.status(403).json({message:"update profile Error : "+err.message,data:null});
    });
}
exports.SyncData = function(req,res){
    UserModel.syncdata(req.query).tap(console.log)
    .then(account=>{
        res.status(200).json({message:"Login OK",
            data:{user:account.omit(['password','access_token']),
            access_token:account.get('access_token'),
            auth_token_type:SupportAuth_Token_Type.Bearer}
        });
    })
    .catch(err=>{res.status(403).json({message:err.message,data:null})})
}
exports.topUpMoney = function(req,res){
    CreditModel.topUpMoney(req.body)
        .tap(console.log)
        .then(result=>{
            res.status(200).json({message:"Topup money OK",data:null});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        });
}
exports.fetchRemoteUserData = function (req,res){
    UserModel.fetchRemoteUserData(req.query)
        .tap(console.log)
        .then(result=>{
            res.status(200).json({message:"fetch Remote user data ok",data:result});
        })
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        })
}
exports.fetchTableExchange = function(req,res){
    Table_ExchangeModel.fetchTableExchange()
        .tap(console.log)
        .then(result=>{
            res.status(200).json({message:"Fetch table exchange OK",data:result.toJSON()});
        })
        .catch(console.log)
        .catch(err=>{
            res.status(403).json({message:+err.message,data:null});
        });
}

const SupportAuth_Token_Type = {
    Read_Only:"ReadOnly",
    Bearer:"Bearer",
    Write:"Write"
}
var omitSomeUserData = (user)=>{
    return _.omit(user,['rate_point']);
}
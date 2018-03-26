var Account = require('../model/accountModel');
var Account_Role = require('../model/account_roleModel');
var Role = require('../model/roleModel');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var Employer = require('../model/employerModel');
var Employee = require('../model/employeeModel');
var Profile = require('../model/profileModel');
var uuidv4 = require('uuid/v4');
var Promise = require('bluebird');
var Balance = require('../model/balanceModel');
var User = require('../model/userModel');
var bookshelf = require('../db/dbconnect').bookshelf;
exports.SignUp = function(req,res){
    var obj = req.body;
    
    bcrypt.hash(obj.password,10).then(hashpassword=>{
        obj.id = uuidv4();
        obj.password=hashpassword;
        Account.AccountModel.signup(obj).then(result=>{
            res.status(200).json({message:"Signup OK",data:null});
        })
        .then(console.log)
        .catch(err=>{
            res.status(400).json({message:err.message,data:null});
        });
    })
    .then(console.log)
    .catch(err=>{
        console.log(err);
        res.status(500).json({message:err.message,data:null});
    });
    
}
exports.Login = function(req,res){
    const {username,password,email} = req.body;
    Account.AccountModel.login(req.body).then(account=>{
        res.status(200).json({message:"Login OK",
        data:_.omit(account.toJSON(),(['id','password','created_date','updated_at','accounts_roles']))});
    }).catch(Account.AccountModel.NotFoundError,()=>{
        res.status(400).json({message:"Can't found user pls SignUp",data:null});
    }).catch(err=>{
        console.log(err);
        res.status(400).json({message:err.message,data:null});
    })
    /* if(!username || !password){
        res.status(500).json({message:"username or password required",data:null});
    }else{
        Account.AccountModel.query({
            where:{username:username},orWhere:{email:email}
        }).fetch({require:true,withRelated:['balance','accounts_roles.role','user']}).then(result=>{
            let account = model.toJSON();
            account.role_list = account.accounts_roles.map((obj)=>{return {idrole:obj.role.idrole,rolename:obj.role.name,status:obj.status}});
            bcrypt.compare(password,account.password).then(result=>{
                if(result){
                    //password true
                    let checkuserrole = account.role_list.find((element)=>{return element.rolename=='user' && element.status==1;});// if user exist user role not blocked
                    if(checkuserrole){
                        //not blocked user role account
                        account =_.omit(account,['id','password','employer_id','employee_id','created_date','updated_at','accounts_roles']);
                        res.status(200).json({message:`login success`,
                        data:Object.assign(account,{access_token:jwt.sign(account,process.env.SECRET_KEY)})});
                    }else{
                        //account user role have been blocked
                        res.status(400).json({message:'your account have been blocked pls contact us for more detail',data:null});
                    }
                }else{
                    //password false
                    res.status(404).json({message:`wrong password with ${account.username}`,data:null});
                }
            }).catch(err=>{
                res.status(401).json({message:`can't compare password : error : ${err.message}`,data:null});
            });
                //result type boolean
                
        }).catch(Account.AccountModel.NotFoundError,function(){
            res.status(400).json({message:`${username} not found`,data:null});
        })
        .catch(err=>{
            res.status(400).json({message:`error from database ${err.message}`,data:null});
        }); */
        /* Account.AccountModel.where('username',username)
        .fetch({withRelated:['employer','employee.profile','accounts_roles.role']},{require:true})
        .then(function(model){
            let account = model.toJSON();
            account.role_list = account.accounts_roles.map((obj)=>{return {idrole:obj.role.idrole,rolename:obj.role.name}});
            bcrypt.compare(password,account.password).then(result=>{
                //result type boolean
                if(result){
                    account =_.omit(account,['id','password','employer_id','employee_id','created_date','updated_at','accounts_roles']);
                    res.status(200).json({message:`login success`,
                    data:Object.assign(account,{access_token:jwt.sign(account,process.env.SECRET_KEY)})});
                }else{
                    res.status(404).json({message:`wrong password with ${account.username}`,data:null});
                }
            }).catch(err=>{
                console.log(err);
                res.status(400).json({message:err,data:null});
            });
        })
        .catch(Account.AccountModel.NotFoundError,function(){
            res.status(400).json({message:`${username} not found`,data:null});
        })
        .catch(err=>{
            res.status(400).json({message:err.message,data:null});
        }); */
    }
exports.loginRequired=function(req,res,next){
    if(req.user){
        next();
    }else{
        return res.status(401).json({message:`Unauthorized user`,data:null});
    }
}
exports.test = function(req,res){
    console.log("success");
}
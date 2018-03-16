var Account = require('../model/accountModel');
var Account_Role = require('../model/account_roleModel');
var Role = require('../model/roleModel');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var Employer = require('../model/employerModel');
var Employee = require('../model/employeeModel');
var uuidv4 = require('uuid/v4');

exports.SignUp = function(req,res){
    var obj = req.body;
    obj.employer_id = uuidv4();//generate uuid for employerid
    obj.employee_id = uuidv4();//generate uuid for employeeid
    bcrypt.hash(obj.password,10).then(hashpassword=>{
        obj.password=hashpassword;
        Account.AccountModel.forge(obj).save().then(function(model){
            let roles_accounts = [{idaccount:model.id,idrole:2,status:1},{idaccount:model.id,idrole:3,status:1}];
            Account_Role.Account_RoleModelCollection.forge(roles_accounts).invokeThen('save').then(function(){
                res.status(200).json({message:`signup success`,data:null});
            });
            Employer.EmployerModel.forge({idemployer:obj.employer_id}).save();
            Employee.EmployeeModel.forge({idemployee:obj.employee_id}).save();
        }).catch(err=>{
            res.status(500).json({message:err.message,data:null});
        });
    }).catch(err=>{
        res.status(500).json({message:`SignUp fail can't hash password pls try again`,data:null});
        console.log(err);
    });
    
}
exports.Login = function(req,res){
    const {username,password} = req.body;
    if(!username || !password){
        res.status(500).json({message:"username or password required",data:null});
    }else{
        Account.AccountModel.where('username',username)
        .fetch({withRelated:['employer','employee','accounts_roles.role']},{require:true})
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
        });
    }
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
var _ = require('lodash');
var Profile = require('../model/profileModel');
var Category_Profile = require('../model/category_profileModel');
var Category = require('../model/categoryModel');
var Account = require('../model/accountModel');
var uuidv4 = require('uuid/v4');
var knex = require('../db/dbconnect').knex;
var User = require('../model/userModel');
var TransactionModel = require('../model/transactionModel').TransactionModel;
exports.getHighRateProfile = function(req,res){
    
    
    /* knex.from('profiles').innerJoin('employees','profiles.idprofile','=','employees.idemployee')
    .select('*').then((model)=>{
        res.json({data:model})
    }).catch(err=>{
        console.log(err);
        res.json({error:err});
    }); */
    /* Account.AccountModel.query(function(db){
        db.innerJoin('employees','employees.idemployee','accounts.employee_id')
        db.innerJoin('profiles','profiles.idprofile','employees.idemployee')
        db.innerJoin('profile_category','profile_category.idprofile','profiles.idprofile')
        db.groupBy('profiles.idprofile');
        db.where('profile_category.idcategory','=',req.query.idcategory);
    })
    .orderBy('profiles.level','DESC')
    .fetchPage({
        pageSize:3,
        page:req.query.page?req.query.page:1,
        withRelated:['employee.profile']
    }).then(result=>{
       let pagination = result.pagination;
       console.log(pagination);
        res.status(200).json({message:"OK",data:{
            query:req.query.idcategory,
            totalcount:pagination.rowCount,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            profiles:result.toJSON()
        }});
    }).catch(err=>{
        res.status(400).json({message:`${err}`,data:null});
    }); */
    /* Profile.ProfileModel.query(function(db){
        db.innerJoin('employees','employees.idemployee','profiles.idprofile')
        db.innerJoin('accounts','accounts.employee_id','employees.idemployee')
        db.innerJoin('profile_category','profile_category.idprofile','profiles.idprofile')
        db.groupBy('profiles.idprofile');
        db.where('profile_category.idcategory','=',req.query.idcategory);
    })
    .orderBy('profiles.level','DESC')
    .fetchPage({
        pageSize:3,
        page:req.query.page?req.query.page:1,
        withRelated:['employee']
    }).then(result=>{
       let pagination = result.pagination;
       console.log(pagination);
        res.status(200).json({message:"OK",data:{
            query:req.query.idcategory,
            totalcount:pagination.rowCount,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            profiles:result.toJSON()
        }});
    }).catch(err=>{
        res.status(400).json({message:`${err}`,data:null});
    }); */
}
function processResponse(array){
    return array.map(function(value){
        let account = _.omit(value,['created_at','updated_at','password','employer_id','employee_id','username']);
        let result = _.assignIn(_.omit(account,['employee']),_.omit(account.employee,['profile']),account.employee.profile);
        return result;
    });
}
var _ = require('lodash');
var {ProfileModel} = require('../model/profileModel');
var {CategoryModel,CategoryCollection} = require('../model/categoryModel');
var uuidv4 = require('uuid/v4');
var {knex} = require('../db/dbconnect');
var {UserModel} = require('../model/userModel');
var Promise = require('bluebird');
var {TransactionModel} = require('../model/transactionModel');
exports.search = function(req,res){
    Promise.all([CategoryModel.searchCategory(req.query),ProfileModel.searchProfile(req.query)]).tap(console.log).then(arr=>{
        res.json({message:"search OK",data:{
            lst_category:arr[0],
            lst_profile:arr[1],
        }})
    })
    .catch(console.log)
    .catch(err=>{
        res.json({message:`${err.message}`,data:null});
    })
}
exports.getProfile = function(req,res){
    
    ProfileModel.getprofile(req.query)
    //.then(console.log)
    .then(result=>{
        let pagination = result.pagination;
        res.status(200).json({message:"OK",data:{
            query:req.query.idcategory,
            totalcount:pagination.rowCount,
            filter:req.query.filter,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            profiles:result.toJSON().map(element=>{
                const {user,account} = {user:element.user,account:element.user.account};
                return Object.assign(_.omit(element,['user','account']),_.omit(user,['account']),account);
            }),
        }});
    })
    
    .catch(console.log)
    .catch(err=>{
        res.status(400).json({message:err.message,data:null});
    })
    
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
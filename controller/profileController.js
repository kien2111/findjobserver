var _ = require('lodash');
var {ProfileModel} = require('../model/profileModel');
var {CategoryModel,CategoryCollection} = require('../model/categoryModel');
var uuidv4 = require('uuid/v4');
var {knex} = require('../db/dbconnect');
var {UserModel} = require('../model/userModel');
var Promise = require('bluebird');
var {TransactionModel} = require('../model/transactionModel');
var {Pakage_UpdateModel} = require('../model/pakage_updateModel');
var {Request_Update_ProfileModel} = require('../model/request_update_profileModel');
exports.search = function(req,res){
    Promise.all([CategoryModel.searchCategory(req.query),ProfileModel.searchProfile(req.query)]).tap(console.log).then(arr=>{
        res.json({message:"search OK",data:{
            lst_category:arr[0],
            lst_profile:arr[1],
        }})
    })
    .catch(err=>{
        res.json({message:`${err.message}`,data:null});
    })
    .catch(console.log)
}
exports.doTaskPublishProfile = function(req,res){
    ProfileModel.doTaskPublishProfile(req.body)
                .tap(console.log)
                .then(result=>{
                    console.log('success');
                    res.status(200).json({message:"Success request",data:null});
                })
                .catch(console.log)
                .catch(err=>{
                    res.status(403).json({message:err.message,data:null});
                })
}
function clean(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
}
exports.getListPakageUpgrade = function(req,res){
    Pakage_UpdateModel.getListPakageUpgrade()
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"fetch OK",data:result.toJSON()});
            })
            .catch(err=>{
                res.status(403).json({messagee:err.message,data:null});
            })
            .catch(console.log);
}
exports.getLastestProcessRequest = function(req,res){
    Request_Update_ProfileModel.getLastestProcessRequest(req.query.iduser)
            .tap(console.log)
            .then(result=>{
                res.status(200).json({message:"fetch OK",data:result.toJSON()});
            })
            .catch(err=>{
                console.log(err.message);
                res.status(403).json({messagee:err.message,data:null});
            })
            .catch(console.log);
}
exports.doTaskUpgradeProfile = function(req,res){
    ProfileModel.doTaskUpgradeProfile(req.body)
        .tap(console.log)
        .then(result=>{
            res.status(200).json({message:"request upgrade profile OK",data:null});
        })
        .catch(err=>{
            console.log(err);
            res.status(403).json({message:err.message,data:null});
        });
}
exports.deleteLastestUpgradeRequest = (req,res)=>{
    Request_Update_ProfileModel.deleteLastestUpgradeRequest(req.query.profile_id)
    .tap(console.log)
    .then(result=>{
        res.status(200).json({message:"Hủy thành công",data:null});
    })
    .catch(err=>{
        res.status(403).json({message:err.message,data:null});
    })
}
exports.fetchDetaiProfileWithId = function(req,res){
    ProfileModel.fetchDetaiProfileWithId(req.query.idprofile)
            .tap(console.log)
            .then(result=>{
                let user = result.toJSON().user;
                let returnresult = Object.assign(_.omit(result.toJSON(),['user']),user);
                res.status(200).json({message:"Fetch OK",data:clean(returnresult)});
            })
            .catch(err=>{
                res.status(403).json({message:err.message,data:null});
            })
            .catch(console.log);
}
exports.getProfile = function(req,res){
    console.log(req.query);
    ProfileModel.getprofile(req.query)
    .tap(console.log)
    //.then(console.log)
    .then(result=>{
        let pagination = result.pagination;
        console.log(result.toJSON());
        res.status(200).json({message:"OK",data:{
            query:req.query.idcategory,
            totalcount:pagination.rowCount,
            nextpage:req.query.page>=pagination.pageCount?-1:pagination.page+1,
            profiles:result.toJSON().map(element=>{
                element.rating = calculateAverage(element.user.user_receive_rate);
                const {user,account} = {user:element.user,account:element.user.account};
                return clean(Object.assign(_.omit(element,['user','account']),_.omit(user,['account']),account));
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
//get all profile
exports.getAllProfile= function(req,res){
    ProfileModel.fetchAll().then(function(model){
        console.log("cai l gi thế");
        res.status(200).json({message:"get all ok",data:model.toJSON()});
    }).catch(function(err){
        res.status(404).json({message:"get error",data:null});
    });
}
exports.getMapProfile = function(req,res){
    ProfileModel.getMapProfile(req.query.lat,req.query.long,req.query.level,req.query.distance,req.query.unit)
        .tap(console.log)
        .then(result=>{
            res.status(200).json({message:"fetch OK",data:result[0]})
        })
        .catch(err=>{
            res.status(403).json({message:err.message,data:null});
        })
}
exports.blockprofile = function(req,res){
    try{

        let profileblock= req.body;
        if(profileblock==null){
            res.status(200).json({message:"data null",data:null});
        }else{
            ProfileModel.adminblocprofile(profileblock)
            .then(resuilt=>{
                if(resuilt)
                {
                    res.status(200).json({message:"block profile ok",data:null});
                }
            }).catch(console.log)
            .catch(err=>{
                res.status(400).json({message:err.message,data:null});
            })
        }
    }
    catch(error){}
}
const calculateAverage = (arrayobj)=>{
    if(!arrayobj || arrayobj.length<=0)return 0;
    let result=0;

    arrayobj.forEach(element => {
        result +=element.average_point;
    });
    return result/arrayobj.length;
}
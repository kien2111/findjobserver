var {bookshelf} = require('../db/dbconnect');
var _ = require('lodash');
var Promise = require('bluebird');
var {Request_Update_ProfileModel} = require('../model/request_update_profileModel');
var {UserModel} = require('../model/userModel');
var {CategoryModel} = require('../model/categoryModel');
var ProfileModel = bookshelf.Model.extend({
    tableName:"profiles",
    idAttribute:"idprofile",
    user:function(){
        return this.hasOne('UserModel','iduser','idprofile');
    },
    request_update_profiles:function(){
        return this.hasMany('Request_Update_ProfileModel','profile_id','idprofile');
    },
    category:function(){
        return this.hasOne('CategoryModel','idcategory','category');
    }
},{
    gethighrateprofile:Promise.method(function({idcategory,page}){
        //return this.forge({category:idcategory}).fetch({withRelated:['user']})
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','profiles.idprofile');
            db.innerJoin('accounts','accounts.id','users.iduser');
            db.groupBy('profiles.idprofile');
            db.where('profiles.category','=',idcategory);
        })
        .orderBy('profiles.level','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['user.account','category','user.user_receive_rate']
        })
    }),
    getskilledfreelancerprofile:Promise.method(function(){
        //not handle  
    }),
    searchProfile:Promise.method(function({query}){
        return this.forge().query(qb=>{
            qb.innerJoin('users','profiles.idprofile','users.iduser');
            qb.whereRaw(`MATCH (realname,brand_name_company,about_company,username,email) against ("${query}")`);
        })
        .fetchAll({withRelated:['user']}).then(profiles=>{
            return Promise.map(profiles.toJSON(),(item,index,arr_length)=>{
                return Object.assign(_.omit(item,'user'),item.user);
            });
        });
    }),
    adminblocprofile:Promise.method(function(arr){
        //let role = obj.role;
        //let userdata = _.omit(obj,['role']);
        //console.log(userdata);
        if(!arr) throw new Error("Pls provide data to signup");
        if(!Array.isArray(arr))throw new Error("Param provide not an array");
        return bookshelf.transaction(trx=>{
            return Promise.map(arr,item=>{
                    console.log(item);
                    return new ProfileModel().where({idprofile:item.idprofile})
                    .save(item,{method:"update",transacting:trx,patch:true});
            });
        });
    }),
    // blockuser:Promise.method(function(arr){
    //     console.log(arr);
    //     if(!arr) throw new Error("Pls provide data to signup");
    //     if(!Array.isArray(arr))throw new Error("Param provide not an array");
    //     return bookshelf.transaction(trx=>{
    //         return Promise.map(arr,item=>{
    //             console.log(item);
    //             return new Account_RoleModel().where({iduser:item.iduser})
    //             .save(item,{method:"update",transacting:trx,patch:true});
    //         });
    //     })
    // }),


});
var Profiles = bookshelf.Collection.extend({
    model:ProfileModel,
});
module.exports.ProfileModel = bookshelf.model('ProfileModel',ProfileModel);
module.exports.ProfileCollection = bookshelf.collection('ProfileCollection',Profiles);
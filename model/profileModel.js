var {bookshelf} = require('../db/dbconnect');
var _ = require('lodash');
var Promise = require('bluebird');
var {Request_Update_ProfileModel} = require('../model/request_update_profileModel');
var {UserModel} = require('../model/userModel');
var {CityModel} = require('../model/cityModel');
var {DistrictModel} = require('../model/districtModel');
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
    },
    city:function(){
        return this.hasOne('CityModel','cityid','cityid');
    },
    district:function(){
        return this.hasOne('DistrictModel','distid','distid');
    }
},{
    getprofile:Promise.method(function({idcategory,page,filter}){
        //return this.forge({category:idcategory}).fetch({withRelated:['user']})
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','profiles.idprofile');
            db.leftJoin('cities','cities.cityid','profiles.cityid');
            db.leftJoin('districts','districts.distid','profiles.distid');
            db.groupBy('profiles.idprofile');
            db.where('profiles.category','=',idcategory);
            if(filter){
                db.andWhere(function(){
                    this.where('cities.namecity','=',filter);
                    this.orWhere('districts.namedist','=',filter);
                });
            }
        })
        .orderBy('profiles.level','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['category','user.user_receive_rate','district','city']
        })
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
});
var Profiles = bookshelf.Collection.extend({
    model:ProfileModel,
});
module.exports.ProfileModel = bookshelf.model('ProfileModel',ProfileModel);
module.exports.ProfileCollection = bookshelf.collection('ProfileCollection',Profiles);
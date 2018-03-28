var bookshelf = require('../db/dbconnect').bookshelf;
require('./employeeModel').EmployeeModel;
require('./field_profileModel').Field_ProfileModel;
require('./category_profileModel').Category_ProfileModel;
require('./request_update_profileModel').Request_Update_ProfileModel;
require('./fieldModel').FieldModel;
var Promise = require('bluebird');
require('./userModel').UserModel;
require('./categoryModel').CategoryModel;
var ProfileModel = bookshelf.Model.extend({
    tableName:"profiles",
    idAttribute:"idprofile",
    employee:function(){
        return this.hasOne('EmployeeModel','idemployee','idprofile');
    },
    fields_profiles:function(){
        return this.hasMany('Field_ProfileModel','profile_id','idprofile');
    },
    categories_profiles:function(){
        return this.hasMany('Category_ProfileModel','idprofile','idprofile');
    },
    user:function(){
        return this.hasOne('UserModel','iduser','idprofile');
    },
    request_update_profiles:function(){
        return this.hasMany('Request_Update_ProfileModel','profile_id','idprofile');
    },
    fields:function(){
        return this.hasMany('FieldModel','idfield','idprofile');
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
          
    }),
});
var Profiles = bookshelf.Collection.extend({
    model:ProfileModel,
});
module.exports.ProfileModel =bookshelf.model('ProfileModel',ProfileModel);
module.exports.ProfileCollection = bookshelf.collection('ProfileCollection',Profiles);
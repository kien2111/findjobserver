var {bookshelf} = require('../db/dbconnect');
var {TransactionModel} = require('../model/transactionModel');
var {AppointmentModel} = require('../model/appointmentModel');
var Promise = require('bluebird');
require('../model/profileModel').ProfileModel;
var Joi = require('joi');
var Promise = require('bluebird');
var UserModel = bookshelf.Model.extend({
    tableName:"users",
    idAttribute:'iduser',
    user_give:function(){
        return this.hasMany('TransactionModel','user_give','iduser');
    },
    user_receive:function(){
        return this.hasOne('TransactionModel','user_receive','iduser');
    },
    profile:function(){
        return this.hasOne('ProfileModel','idprofile','iduser');
    },
    user_receive_rate:function(){
        return this.hasMany('RateModel','user_who_receive_this_rate','iduser');
    },
    user_give_rate:function(){
        return this.hasMany('RateModel','user_who_rate_this','iduser');
    },
    user_create_appointments(){
        return this.hasMany('AppointmentModel','user_who_create_appointment','iduser');
    },
    user_take_appointments(){
        return this.hasMany('AppointmentModel','user_who_receive_appointment','iduser');
    },
    

    //bussiness logic
    initialize:function(){
        this.constructor.__super__.initialize.apply(this,arguments);
        this.on('saving',this.validateSave);
    },
    validateSave:function(){
        return Joi.validate(this.attributes,JoiUserSchema);
    },
   
},{
    getdetailprofile:Promise.method(function({iduser}){
        return this.forge(iduser).fetch({withRelated:['account','profile'],require:true});
    }),
})
const JoiUserSchema = Joi.object().keys({
    iduser:Joi.string(),
    realname:Joi.string().min(6).max(200),
    brand_name_company:Joi.string().min(3).max(200),
    gender:Joi.number(),
    logo_company:Joi.string().max(255),
});

var Users = bookshelf.Collection.extend({
    model:UserModel
})
module.exports.UserModel = bookshelf.model('UserModel',UserModel);
module.exports.UserCollection = bookshelf.collection('UserCollection',Users);

var { CategoryModel } = require('../model/categoryModel');

var {bookshelf} = require('../db/dbconnect');
var _ = require('lodash');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var uuidv4 = require('uuid/v4');
var Joi = require('joi');
var jwt = require('jsonwebtoken');
var {TransactionModel} = require('../model/transactionModel');
var {AppointmentModel} = require('../model/appointmentModel');
var {Account_RoleModel} = require('../model/account_roleModel');
var {ProfileModel} = require('../model/profileModel');
var UserModel = bookshelf.Model.extend({
    tableName:"users",
    idAttribute:'iduser',
    hidden:['password','created_at','updated_at'],
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
    accounts_roles(){
        return this.hasMany('Account_RoleModel','iduser','iduser');
    },
    checkrole:function(value){
        /**
         * value:{
         *  rolename: 'user' or 'admin'
         *  status : 1 or 0
         * }
         */
        return value.status==1;
    },
    processResponse:function(obj){
            /**
             * obj :{
             *  idrole,
             *  status,
             *  accountid
             * }
             */
            console.log(obj);
            return {
                idrole:obj.role.idrole,
                rolename:obj.role.rolename,
                status:obj.status
            }
    },

    //bussiness logic
    initialize:function(){
        this.constructor.__super__.initialize.apply(this,arguments);
        //this.on('saving',this.validateSave);
    },
    validateSave:function(){
        return Joi.validate(this.attributes,JoiUserSchema);
    },
   
},{
    login:Promise.method(function({username,password}){
        if(!password || !username)throw new Error('Email or Username and password are required');
        return this.forge({username:username})
        .fetch({require:true,withRelated:['accounts_roles.role','profile.category']})
        .tap(account=>{
            console.log(account.toJSON().profile);
            return bcrypt.compareAsync(password,account.get('password'))
            .then(res=>{
                if(!res) throw new Error('Invalid Password');
                let result = account.toJSON().accounts_roles
                account.role_list = result.map(account.processResponse);
                if(!account.role_list.find(account.checkrole))throw new Error("The account have been blocked");
                account.set('role_list',account.role_list);
                account.set('profile',account.toJSON().profile);
                account.set('access_token',jwt.sign(account.toJSON(),process.env.SECRET_KEY));
            });
        })
    }),
    signup:Promise.method(function(obj){
        if(!obj) throw new Error("Pls provide data to signup");
        if(typeof obj !=='object')throw new Error("Param provide not an object");
        return bookshelf.transaction(trx=>{
           return bcrypt.genSaltAsync(5).then(gensalt=>{
                return bcrypt.hashAsync(obj.password,gensalt).then(hashpassword=>{
                    obj.iduser = uuidv4()
                    obj.password = hashpassword;
                    return this.forge(obj).save(null,{method:'insert',transacting:trx})
                    .tap(user=>{
                        return Promise.all([new Account_RoleModel({iduser:user.get('iduser')}).save(null,{method:'insert',transacting:trx}),
                        user.profile().constructor.forge({idprofile:user.get('iduser')}).save(null,{method:'insert',transacting:trx})]);
                    });
                })
           });
        });
    }),
    getdetailprofile:Promise.method(function({iduser}){
        return bookshelf.knex.select('*',bookshelf.knex.raw("(select AVG(average_point) from rates as r where r.user_who_receive_this_rate = u.iduser)  as point"))
        .from('users as u')
        .where(bookshelf.knex.raw('iduser = ?',iduser))
        .first();
    }),
    updateProfile:Promise.method(function(user){
        let self = this;
        let dataupdate = _.omit(user,['profile','role_list']);
        let category = _.omit(user.profile.category,['num_profile']);
        let profile = _.omit(user.profile,['category']);
        dataupdate.birthday = new Date(dataupdate.birthday);
        return bookshelf.transaction(function(trx){
            return self.forge(dataupdate)
                    .where({iduser:user.iduser})
                    .save(null,{method:'update',transacting:trx})
                    .tap(userresult=>{
                        return ProfileModel.forge(profile)
                        .where({idprofile:profile.idprofile})
                        .save(null,{method:'update',transacting:trx});
                    })
                    .tap(profileresult=>{
                        return CategoryModel.forge(category)
                        .where({idcategory:category.idcategory})
                        .save(null,{method:'update',transacting:trx});
                    });
        })
    }),
    sigupadmin:Promise.method(function(obj){
        let role = obj.role;
        let userdata = _.omit(obj,['role']);
        if(!obj) throw new Error("Pls provide data to signup");
        if(typeof obj !=='object')throw new Error("Param provide not an object");
        return bookshelf.transaction(trx=>{
           return bcrypt.genSaltAsync(5).then(gensalt=>{
                return bcrypt.hashAsync(obj.password,gensalt).then(hashpassword=>{
                    userdata.iduser = uuidv4()
                    userdata.password = hashpassword;
                    return this.forge(userdata).save(null,{method:'insert',transacting:trx})
                    .tap(user=>{
                        return Promise.all([new Account_RoleModel({iduser:user.get('iduser'),idrole:role.idrole}).save(null,{method:'insert',transacting:trx})
                            ,ProfileModel.forge({idprofile:user.get('iduser')}).save(null,{method:'insert',transacting:trx})
                        ]);
                    });
                })
           });
        });
    }),
    //update user
    updateadmin:Promise.method(function(obj){
        let userdata = _.omit(obj,['idrole']);
        if(!obj) throw new Error("Pls provide data to signup");
        if(typeof obj !=='object')throw new Error("Param provide not an object");
        return bookshelf.transaction(trx=>{
            return this.forge(userdata).where({iduser:userdata.iduser}).save(null,{method:'update',transacting:trx})
            .tap(user=>{
                return new Account_RoleModel({idrole:obj.idrole}).where({iduser:user.get('iduser')})
                .save(null,{method:'update',transacting:trx});
            });
        });
    }),
    //get list user block
    getAllBlockedUser:Promise.method(function({status}){
        return this.forge().query(function(db){
            db.innerJoin('accounts_roles','users.iduser','accounts_roles.iduser');
            db.where('status','=',status);
        }).fetchAll();
    }),
    //block user
    blockuser:Promise.method(function(arr){
        console.log(arr);
        if(!arr) throw new Error("Pls provide data to signup");
        if(!Array.isArray(arr))throw new Error("Param provide not an array");
        return bookshelf.transaction(trx=>{
            return Promise.map(arr,item=>{
                console.log(item);
                return new Account_RoleModel().where({iduser:item.iduser})
                .save(item,{method:"update",transacting:trx,patch:true});
            });
        })
    }),
})
const JoiUserSchema = Joi.object().keys({
    iduser:Joi.string(),
    realname:Joi.string().min(6).max(200),
    phone_company:Joi.string().min(5).max(20),
    phone_individual:Joi.string().max(20).min(5),
    brand_name_company:Joi.string().min(3).max(200),
    logo_company:Joi.string().max(255),
    gender:Joi.number(),
    birthday:Joi.date(),
    budget_from:Joi.number(),
    budget_to:Joi.number(),
    about_company:Joi.string().max(2000),
    username:Joi.string().max(200).min(6),
    password:Joi.string().min(1).max(200),
    email:Joi.string().email().max(200).min(8),
    account_balance:Joi.number(),
    avatar:Joi.string().max(255).min(1),
    gender:Joi.number(),
    logo_company:Joi.string().max(255),

});

var Users = bookshelf.Collection.extend({
    model:UserModel
})
module.exports.UserModel = bookshelf.model('UserModel',UserModel);
module.exports.UserCollection = bookshelf.collection('UserCollection',Users);
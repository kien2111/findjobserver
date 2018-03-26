var BalanceModel = require('./balanceModel').BalanceModel;
var Account_RoleModel = require('./account_roleModel').Account_RoleModel;
var EmployeeModel =  require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var NotificationModel = require('./notificationModel').NotificationModel;
var FeedBackModel = require('./feedbackModel').FeedBackModel;
var bookshelf = require('../db/dbconnect').bookshelf;
var UserModel = require('./userModel').UserModel;
var Promise = require('bluebird');
var jwt = require('jsonwebtoken');
var ProfileModel = require('../model/profileModel').ProfileModel;
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var AccountModel= bookshelf.Model.extend({
    tableName:"accounts",
    idAttrbute:"id",
    hasTimestamps:true,
    /* employee:function(){
        return this.belongsTo(EmployeeModel,'employee_id','idemployee');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'employer_id','idemployer');
    }, */
    feedbacks:function(){
        return this.hasMany(FeedBackModel,'account_id','id');
    },
    user:function(){
        return this.hasOne(UserModel,'iduser','id');
    },
    accounts_roles:function(){
        return this.hasMany(Account_RoleModel,'idaccount','id');
    },
    balance:function(){
        return this.hasOne(BalanceModel,'idbalance','id');
    },
    notifications:function(){
        return this.hasMany(NotificationModel,'account_id','id');
    },

    
    checkrole:function(value){
        /**
         * value:{
         *  rolename: 'user' or 'admin'
         *  status : 1 or 0
         * }
         */
        return value.rolename=='user' && value.status==1;
    },
    processResponse:function(obj){
            /**
             * obj :{
             *  idrole,
             *  status,
             *  accountid
             * }
             */
            return {
                idrole:obj.role.idrole,
                rolename:obj.role.name,
                status:obj.status
            }
    }
},{
    login:Promise.method(function({email,username,password}){
        if(!email || !password || !username)throw new Error('Email or Username and password are required');
        return this.forge({email:email.toLowerCase().trim()}).fetch({require:true,withRelated:['balance','accounts_roles.role','user']}).tap(account=>{
            return bcrypt.compareAsync(password,account.get('password')).then(res=>{
                if(!res) throw new Error('Invalid Password');
                let result = account.toJSON().accounts_roles
                account.role_list = result.map(account.processResponse);
                if(!account.role_list.find(account.checkrole))throw new Error("The account have been blocked");
                account.set('role_list',account.role_list);
                account.set('access_token',jwt.sign(account.toJSON(),process.env.SECRET_KEY));
            });
        })
    }),
    signup:Promise.method(function(obj){
        if(!obj) throw new Error("Pls provide data to signup");
        return bookshelf.transaction(trx=>{
            return this.forge(obj).save(null,{method:'insert',transacting:trx})
            .tap(account=>{
                return Promise.all([UserModel.forge({iduser:obj.id}).save(null,{method:'insert',transacting:trx}),
                BalanceModel.forge({idbalance:obj.id}).save(null,{method:'insert',transacting:trx}),
                Account_RoleModel.forge({idaccount:obj.id}).save(null,{method:'insert',transacting:trx}),
                ProfileModel.forge({idprofile:obj.id}).save(null,{method:'insert',transacting:trx})]);
            });
        });
    }),
});

var Accounts = bookshelf.Collection.extend({
    model:AccountModel,
});
module.exports.AccountModel = AccountModel;
module.exports.AccountCollection =Accounts;
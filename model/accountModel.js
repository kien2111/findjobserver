var BalanceModel = require('./balanceModel').BalanceModel;
var Account_RoleModel = require('./account_roleModel').Account_RoleModel;
var EmployeeModel =  require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var NotificationModel = require('./notificationModel').NotificationModel;
var FeedBackModel = require('./feedbackModel').FeedBackModel;
var bookshelf = require('../db/dbconnect').bookshelf;
var UserModel = require('./userModel').UserModel;
var bcrypt = require('bcrypt');
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
        return this.hasOne(UserModel,'iduser','iduser');
    },
    accounts_roles:function(){
        return this.hasMany(Account_RoleModel,'idaccount','id');
    },
    balance:function(){
        return this.hasOne(BalanceModel,'idbalance','id');
    },
    notifications:function(){
        return this.hasMany(NotificationModel,'account_id','id');
    }
});
var Accounts = bookshelf.Collection.extend({
    model:AccountModel,
});
module.exports.AccountModel = AccountModel;
module.exports.AccountCollection =Accounts;
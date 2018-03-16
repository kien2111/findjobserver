var BalanceModel = require('./balanceModel').BalanceModel;
var Account_RoleModel = require('./account_roleModel').Account_RoleModel;
var EmployeeModel =  require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var bookshelf = require('../db/dbconnect');
var bcrypt = require('bcrypt');
var AccountModel= bookshelf.Model.extend({
    tableName:"accounts",
    hasTimestamps:true,
    employee:function(){
        return this.belongsTo(EmployeeModel,'employee_id','idemployee');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'employer_id','idemployer');
    },
    accounts_roles:function(){
        return this.hasMany(Account_RoleModel,'idaccount','id');
    },
    balance:function(){
        return this.hasOne(BalanceModel,'idbalance','id');
    },
});
var Accounts = bookshelf.Collection.extend({
    model:AccountModel,
});
module.exports.AccountModel = AccountModel;
module.exports.AccountCollection =Accounts;
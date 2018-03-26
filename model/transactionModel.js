var bookshelf = require('../db/dbconnect').bookshelf;
var EmployerModel = require('./employerModel').EmployerModel;
var EmployeeModel = require('./employeeModel').EmployeeModel;
var UserModel = require('../model/userModel').UserModel;
var TransactionModel = bookshelf.Model.extend({
    tableName:"transactions",
    idAttribute:'idtransaction',
    hasTimestamps:true,
    employee:function(){
        return this.belongsTo(EmployeeModel,'idemployee','employee_id');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'idemployer','employer_id');
    },
    user_give:function(){
        return this.hasOne(UserModel,'iduser','user_give');
    },
    user_receive:function(){
        return this.hasOne(UserModel,'iduser','user_receive');
    }
});
var Transactions = bookshelf.Collection.extend({
    model:TransactionModel,
});
module.exports.TransactionModel = TransactionModel;
module.exports.TransactionCollection = Transactions;
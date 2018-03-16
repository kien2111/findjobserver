var bookshelf = require('../db/dbconnect');
var EmployerModel = require('./employerModel').EmployerModel;
var EmployeeModel = require('./employeeModel').EmployeeModel;
var TransactionModel = bookshelf.Model.extend({
    tableName:"transactions",
    hasTimestamps:true,
    employee:function(){
        return this.belongsTo(EmployeeModel,'idemployee','employee_id');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'idemployer','employer_id');
    }
});
var Transactions = bookshelf.Collection.extend({
    model:TransactionModel,
});
module.exports.TransactionModel = TransactionModel;
module.exports.TransactionCollection = Transactions;
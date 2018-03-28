var bookshelf = require('../db/dbconnect').bookshelf;
require('./appointmentModel').AppointmentModel;
require('../model/accountModel').AccountModel;
require('./transactionModel').TransactionModel;
require('./profileModel').ProfileModel;
require('./rateModel').RateModel;
require('./emp_locationModel').Emp_LocationModel;
var EmployeeModel = bookshelf.Model.extend({
    tableName:"employees",
    idAttribute:"idemployee",
    allAccounts:function(){
        return this.hasMany('AccountModel','employee_id','idemployee');
    },
    appointments:function(){
        return this.hasMany('AppointmentModel','employee_id','idemployee');
    },
    transations:function(){
        return this.hasMany('TransactionModel','employee_id','idemployee');
    },
    profile:function(){
        return this.hasOne('ProfileModel','idprofile','idemployee');
    },
    emp_location:function(){
        return this.belongsTo('Emp_LocationModel','employee_id','idemployee');
    },
    rates:function(){
        return this.hasMany('RateModel','employee_id','idemployee');
    }
});
var Employees = bookshelf.Collection.extend({
    model:EmployeeModel,
});
module.exports.EmployeeModel = bookshelf.model('EmployeeModel',EmployeeModel);
module.exports.EmployeeCollection = bookshelf.collection('EmployeeCollection',Employees);
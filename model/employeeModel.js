var bookshelf = require('../db/dbconnect');
var AppointmentModel = require('./appointmentModel').AppointmentModel;
var AccountModel = require('../model/accountModel').AccountModel;
var TransactionModel = require('./transactionModel').TransactionModel;
var ProfileModel = require('./profileModel').ProfileModel;
var RateModel = require('./rateModel').RateModel;
var Emp_LocationModel = require('./emp_locationModel').Emp_LocationModel;
var EmployeeModel = bookshelf.Model.extend({
    tableName:"employees",
    allAccounts:function(){
        return this.hasMany(AccountModel,'employee_id','idemployee');
    },
    appointments:function(){
        return this.hasMany(AppointmentModel,'employee_id','idemployee');
    },
    transations:function(){
        return this.hasMany(TransactionModel,'employee_id','idemployee');
    },
    profile:function(){
        return this.belongsTo(ProfileModel,'idprofile','idemployee');
    },
    emp_location:function(){
        return this.belongsTo(Emp_LocationModel,'employee_id','idemployee');
    },
    rates:function(){
        return this.hasMany(RateModel,'employee_id','idemployee');
    }
});
var Employees = bookshelf.Collection.extend({
    model:EmployeeModel,
});
module.exports.EmployeeModel = EmployeeModel;
module.exports.EmployeeCollection = Employees;
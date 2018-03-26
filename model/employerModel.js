var AppointmentModel = require('./appointmentModel').AppointmentModel;
var AccountModel = require('../model/accountModel').AccountModel;
var TransactionModel = require('./transactionModel').TransactionModel;
var Emp_LocationModel = require('./emp_locationModel').Emp_LocationModel;
var RateModel = require('./rateModel').RateModel;
var bookshelf = require('../db/dbconnect').bookshelf;
var EmployerModel = bookshelf.Model.extend({
    tableName:"employers",
    allAccount:function(){
        return this.hasMany(AccountModel,'employer_id','idemployer');
    },
    appointments:function(){
        return this.hasMany(AppointmentModel,'employer_id','idemployer');
    },
    transations:function(){
        return this.hasMany(TransactionModel,'employer_id','idemployer');
    },
    emp_location:function(){
        return this.belongsTo(Emp_LocationModel,'employer_id','idemployer');
    },
    rates:function(){
        return this.hasMany(RateModel,'employer_id','idemployer');
    }
});
var Employers = bookshelf.Collection.extend({
    model:EmployerModel,
});
module.exports.EmployerModel = EmployerModel;
module.exports.EmployerCollection = Employers;
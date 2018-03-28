require('./appointmentModel').AppointmentModel;
require('../model/accountModel').AccountModel;
require('./transactionModel').TransactionModel;
require('./emp_locationModel').Emp_LocationModel;
require('./rateModel').RateModel;
var bookshelf = require('../db/dbconnect').bookshelf;
var EmployerModel = bookshelf.Model.extend({
    tableName:"employers",
    allAccount:function(){
        return this.hasMany('AccountModel','employer_id','idemployer');
    },
    appointments:function(){
        return this.hasMany('AppointmentModel','employer_id','idemployer');
    },
    transations:function(){
        return this.hasMany('TransactionModel','employer_id','idemployer');
    },
    emp_location:function(){
        return this.belongsTo('Emp_LocationModel','employer_id','idemployer');
    },
    rates:function(){
        return this.hasMany('RateModel','employer_id','idemployer');
    }
});
var Employers = bookshelf.Collection.extend({
    model:EmployerModel,
});
module.exports.EmployerModel = bookshelf.model('EmployerModel',EmployerModel);
module.exports.EmployerCollection = bookshelf.collection('EmployerCollection',Employers);
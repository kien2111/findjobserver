var {bookshelf} = require('../db/dbconnect');
var {AppointmentModel} = require('./appointmentModel');
var Promise = require('bluebird');

var Deposit_FeeModel = bookshelf.Model.extend({
    tableName:"deposit_fee",
    idAttribute:'iddeposit_fee',
    hasTimestamps:true,
    appointments:function(){
        return this.hasMany('AppointmentModel','iddeposit_fee','iddeposit_fee');
    }
},{
    getAvailableDepositFee:Promise.method(function(){
        return this.forge().where('apply','=','1').fetch({require:true});
    }),
});
var Deposit_Fees = bookshelf.Collection.extend({
    model:Deposit_FeeModel,
});
module.exports.Deposit_FeeModel = bookshelf.model('Deposit_FeeModel',Deposit_FeeModel);
module.exports.Deposit_FeeCollection = bookshelf.collection('Deposit_FeeCollection',Deposit_Fees);
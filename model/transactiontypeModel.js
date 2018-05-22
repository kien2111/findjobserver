var {bookshelf} = require('../db/dbconnect');
var {TransactionModel} = require('./transactionModel');
var Promise = require('bluebird');
var {enumTransaction,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    TransactionType,
    enumStatusAppointment} = require('./globalconstant');
var TransactionTypeModel = bookshelf.Model.extend({
    tableName:"transactiontype",
    idAttribute:'idtransactiontype',
    transactions:function(){
        return this.hasMany('TransactionModel','transaction_type','idtransactiontype');
    }
});
var TransactionTypes = bookshelf.Collection.extend({
    model:TransactionTypeModel,
},{
    
});
module.exports.TransactionTypeModel = bookshelf.model('TransactionTypeModel',TransactionTypeModel);
module.exports.TransactionTypeCollection = bookshelf.collection('TransactionTypeCollection',TransactionTypes);

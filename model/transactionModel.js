var {bookshelf} = require('../db/dbconnect');
var {UserModel} = require('../model/userModel');
var Promise = require('bluebird');
var TransactionModel = bookshelf.Model.extend({
    tableName:"transactions",
    idAttribute:'idtransaction',
    hasTimestamps:true,
    user_give:function(){
        return this.hasOne('UserModel','iduser','user_give');
    },
    user_receive:function(){
        return this.hasOne('UserModel','iduser','user_receive');
    }
});
var Transactions = bookshelf.Collection.extend({
    model:TransactionModel,
},{

});
module.exports.TransactionModel = bookshelf.model('TransactionModel',TransactionModel);
module.exports.TransactionCollection = bookshelf.collection('TransactionCollection',Transactions);
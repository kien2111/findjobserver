var {Table_ExchangeModel} = require('./table_exchangeModel');
var {bookshelf} = require('../db/dbconnect');
var CreditModel = bookshelf.Model.extend({
    tableName:"credits",
    table_exchange:function(){
        return this.belongsTo('Table_ExchangeModel','nominal_value','nominal_value');
    },
});
var Credits = bookshelf.Collection.extend({
    model:CreditModel,
});
module.exports.CreditModel = bookshelf.model('CreditModel',CreditModel);
module.exports.CreditCollection = bookshelf.collection('CreditCollection',Credits);
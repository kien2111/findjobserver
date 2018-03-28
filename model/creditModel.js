require('./coin_exchangeModel').Coin_ExchangeModel;
var bookshelf = require('../db/dbconnect').bookshelf;
var CreditModel = bookshelf.Model.extend({
    tableName:"credits",
    coin_exchange:function(){
        return this.belongsTo('Coin_ExchangeModel','nominal_value','nominal_value');
    },
});
var Credits = bookshelf.Collection.extend({
    model:CreditModel,
});
module.exports.CreditModel = bookshelf.model('CreditModel',CreditModel);
module.exports.CreditCollection = bookshelf.collection('CreditCollection',Credits);
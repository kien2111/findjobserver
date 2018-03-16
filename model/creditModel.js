var Coin_ExchangeModel = require('./coin_exchangeModel');
var bookshelf = require('../db/dbconnect');
var CreditModel = bookshelf.Model.extend({
    tableName:"credits",
    coin_exchange:function(){
        return this.belongsTo(Coin_ExchangeModel,'nominal_value','nominal_value');
    },
});
var Credits = bookshelf.Collection.extend({
    model:CreditModel,
});
module.exports.CreditModel = CreditModel;
module.exports.CreditCollection = Credits;
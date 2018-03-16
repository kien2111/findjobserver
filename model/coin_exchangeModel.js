var bookshelf = require('../db/dbconnect');
var CreditModel = require('./creditModel').CreditModel;
var Coin_ExchangeModel = bookshelf.Model.extend({
    tableName:"coin_exchange",
    credits:function(){
        return this.hasMany(CreditModel,'nominal_value','nominal_value');
    },
});
var Coin_Exchanges = bookshelf.Collection.extend({
    model:Coin_ExchangeModel,
});
module.exports.Coin_ExchangeModel = Coin_ExchangeModel;
module.exports.Coin_ExchangeCollection =Coin_Exchanges;
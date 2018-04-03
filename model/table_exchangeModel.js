var {bookshelf} = require('../db/dbconnect');
var {CreditModel} = require('./creditModel');
var Table_ExchangeModel = bookshelf.Model.extend({
    tableName:"table_exchange",
    credits:function(){
        return this.hasMany('CreditModel','nominal_value','nominal_value');
    },
});
var Table_Exchanges = bookshelf.Collection.extend({
    model:Table_ExchangeModel,
});
module.exports.Table_ExchangeModel = bookshelf.model('Table_ExchangeModel',Table_ExchangeModel);
module.exports.Table_ExchangeCollection =bookshelf.collection('Table_ExchangeCollection',Table_Exchanges);
var {bookshelf} = require('../db/dbconnect');
var {CreditModel} = require('./creditModel');
var Promise = require('bluebird');
var {enumTransaction,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var _ = require('lodash');
var Table_ExchangeModel = bookshelf.Model.extend({
    tableName:"table_exchange",
    credits:function(){
        return this.hasMany('CreditModel','nominal_value','nominal_value');
    },
},{
    fetchTableExchange:Promise.method(function(){
        return this.forge().fetchAll({require:true,columns:['nominal_value','amount_of_coin']});
    }),
});
var Table_Exchanges = bookshelf.Collection.extend({
    model:Table_ExchangeModel,
});
module.exports.Table_ExchangeModel = bookshelf.model('Table_ExchangeModel',Table_ExchangeModel);
module.exports.Table_ExchangeCollection =bookshelf.collection('Table_ExchangeCollection',Table_Exchanges);
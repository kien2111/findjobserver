var {bookshelf} = require('../db/dbconnect');
var {CriteriaModel} = require('./criteriaModel');
var {RateModel} = require('./rateModel');
var Criteria_RateModel = bookshelf.Model.extend({
    tableName:"criteria_rate",
    criteria:function(){
        return this.belongsTo('CriteriaModel','idcriteria','criteria_id');
    },
    rate:function(){
        return this.belongsTo('RateModel','idrate','rate_id');
    }
});
var Criteria_Rates = bookshelf.Collection.extend({
    model:Criteria_RateModel,
});
module.exports.Criteria_RateModel = bookshelf.model('Criteria_RateModel',Criteria_RateModel);
module.exports.Criteria_RateCollection = bookshelf.collection('Criteria_RateCollection',Criteria_Rates);
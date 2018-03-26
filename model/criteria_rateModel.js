var bookshelf = require('../db/dbconnect').bookshelf;
var CriteriaModel = require('./criteriaModel').CriteriaModel;
var RateModel = require('./rateModel').RateModel;
var Criteria_RateModel = bookshelf.Model.extend({
    tableName:"criteria_rate",
    criteria:function(){
        return this.belongsTo(CriteriaModel,'idcriteria','criteria_id');
    },
    rate:function(){
        return this.belongsTo(RateModel,'idrate','rate_id');
    }
});
var Criteria_Rates = bookshelf.Collection.extend({
    model:Criteria_RateModel,
});
module.exports.Criteria_RateModel = Criteria_RateModel;
module.exports.Criteria_RateCollection = Criteria_Rates;
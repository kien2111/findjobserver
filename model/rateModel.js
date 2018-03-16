var bookshelf = require('../db/dbconnect');
var Criteria_RateModel = require('./criteria_rateModel').Criteria_RateModel;
var RateModel = bookshelf.Model.extend({
    tableName:"rates",
    criteria_rate:function(){
        return this.hasMany(Criteria_RateModel,'rate_id','idrate');
    }
});
var Rates = bookshelf.Collection.extend({
    model:RateModel,
});
module.exports.RateModel = RateModel;
module.exports.RateCollection = Rates;
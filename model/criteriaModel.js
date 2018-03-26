var bookshelf = require('../db/dbconnect').bookshelf;
var Criteria_RateModel = require('./criteria_rateModel').Criteria_RateModel;
var CriteriaModel = bookshelf.Model.extend({
    tableName:"criterias",
    idAttribute:'idcriteria',
    criteria_rate:function(){
        return this.hasMany(Criteria_RateModel,'criteria_id','idcriteria');
    },
});
var Criterias = bookshelf.Model.extend({
    model:CriteriaModel,
});
module.exports.CriteriaModel = CriteriaModel;
module.exports.CriteriaCollection = Criterias;
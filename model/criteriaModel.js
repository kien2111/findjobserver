var {bookshelf} = require('../db/dbconnect');
var {Criteria_RateModel} = require('./criteria_rateModel');
var CriteriaModel = bookshelf.Model.extend({
    tableName:"criterias",
    idAttribute:'idcriteria',
    criteria_rate:function(){
        return this.hasMany('Criteria_RateModel','criteria_id','idcriteria');
    },
});
var Criterias = bookshelf.Collection.extend({
    model:CriteriaModel,
});
module.exports.CriteriaModel = bookshelf.model('CriteriaModel',CriteriaModel);
module.exports.CriteriaCollection = bookshelf.collection('CriteriaCollection',Criterias);
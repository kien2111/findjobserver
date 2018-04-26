var {ProfileModel} = require('./profileModel');
var {bookshelf} = require('../db/dbconnect');
var DistrictModel = bookshelf.Model.extend({
    tableName:"districts",
    profiles:function(){
        return this.hasMany('ProfileModel','distid','distid');
    },
});
var Districts = bookshelf.Collection.extend({
    model:DistrictModel,
});
module.exports.DistrictModel =bookshelf.model('DistrictModel',DistrictModel);
module.exports.DistrictCollection = bookshelf.collection('DistrictCollection',Districts);
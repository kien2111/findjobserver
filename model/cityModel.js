var {ProfileModel} = require('./profileModel');
var {bookshelf} = require('../db/dbconnect');
var CityModel = bookshelf.Model.extend({
    tableName:"cities",
    profiles:function(){
        return this.hasMany('ProfileModel','cityid','cityid');
    },
});
var Cities = bookshelf.Collection.extend({
    model:CityModel,
});
module.exports.CityModel =bookshelf.model('CityModel',CityModel);
module.exports.CityCollection = bookshelf.collection('CityCollection',Cities);
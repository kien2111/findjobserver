var bookshelf = require('../db/dbconnect').bookshelf;
var Province_CityModel = require('./province_cityModel').Province_CityModel;
var AddressModel = require('./addressModel').AddressModel;
var WardModel = require('./wardModel').WardModel;
var DistrictModel = bookshelf.Model.extend({
    tableName:"districts",
    idAttribute:'iddistrict',
    province_city:function(){
        return this.belongsTo(Province_CityModel,'idprovince_city','province_city_id');
    },
    addresses:function(){
        return this.hasMany(AddressModel,'district_id','iddistrict');
    },
    wards:function(){
        return this.hasMany(WardModel,'district_id','iddistrict');
    }
});
var Districts = bookshelf.Collection.extend({
    model:DistrictModel,
});
module.exports.DistrictModel = DistrictModel;
module.exports.DistrictCollection = Districts;
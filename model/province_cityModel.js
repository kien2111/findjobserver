var bookshelf = require('../db/dbconnect').bookshelf;
var AddressModel = require('./addressModel').AddressModel;
var DistrictModel = require('./districtModel').DistrictModel;
var Province_CityModel = bookshelf.Model.extend({
    tableName:"provinces_citys",
    idAttribute:'idprovince_city',
    addresses:function(){
        return this.hasMany(AddressModel,'province_city_id','idprovince_city');
    },
    districts:function(){
        return this.hasMany(DistrictModel,'province_city_id','idprovince_city');
    }
});
var Province_Citys = bookshelf.Collection.extend({
    model:Province_CityModel,
});
module.exports.Province_CityModel = Province_CityModel;
module.exports.Province_CityCollection = Province_Citys;
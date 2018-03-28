var bookshelf = require('../db/dbconnect').bookshelf;
require('./streetModel').StreetModel;
require('./province_cityModel').Province_CityModel;
require('./districtModel').DistrictModel;
require('./emp_locationModel').Emp_LocationModel;
require('./wardModel').WardModel;
var AddressModel = bookshelf.Model.extend({
    tableName:"addresses",
    idAttribute:"idaddress",
    street:function(){
        return this.belongsTo('StreetModel','street_id','idstreet');
    },
    ward:function(){
        return this.belongsTo('WardModel','ward_id','idward');
    },
    province_city:function(){
        return this.belongsTo('Province_CityModel','idprovince_city','province_city_id');
    },
    district:function(){
        return this.belongsTo('DistrictModel','iddistrict','district_id');
    },
    emp_location:function(){
        return this.belongsTo('Emp_LocationModel','address_id','idaddress');
    }
});
var Addresses = bookshelf.Collection.extend({
    model:AddressModel,
});
module.exports.AddressModel = bookshelf.model('AddressModel',AddressModel);
module.exports.AddressCollection = bookshelf.collection('AddressCollection',Addresses);
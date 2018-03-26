var bookshelf = require('../db/dbconnect').bookshelf;
var AddressModel =require('./addressModel').AddressModel;
var DistrictModel = require('./districtModel').DistrictModel;
var StreetModel = require('./streetModel').StreetModel;
var WardModel = bookshelf.Model.extend({
    tableName:"wards",
    idAttribute:'idward',
    district:function(){
        return this.belongsTo(DistrictModel,'iddistrict','district_id');
    },
    addresses:function(){
        return this.hasMany(AddressModel,'ward_id','idward');
    },
    streets:function(){
        return this.hasMany(StreetModel,'ward_id','idward');
    }
});
var Wards = bookshelf.Collection.extend({
    model:WardModel,
});
module.exports.WardModel = WardModel;
module.exports.WardCollection = Wards;
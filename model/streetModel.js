var bookshelf = require('../db/dbconnect').bookshelf;
var WardModel = require('./wardModel').WardModel;
var AddressModel = require('./addressModel').AddressModel;
var StreetModel = bookshelf.Model.extend({
    tableName:"streets",
    idAttribute:'idstreet',
    ward:function(){
        return this.belongsTo(WardModel,'idward','idstreet');
    },
    addresses:function(){
        return this.hasMany(AddressModel,'street_id','idstreet');
    }
});
var Streets = bookshelf.Collection.extend({
    model:StreetModel,
});
module.exports.StreetModel = StreetModel;
module.exports.StreetCollection = Streets;
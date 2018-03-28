var bookshelf = require('../db/dbconnect').bookshelf;
require('./wardModel').WardModel;
require('./addressModel').AddressModel;
var StreetModel = bookshelf.Model.extend({
    tableName:"streets",
    idAttribute:'idstreet',
    ward:function(){
        return this.belongsTo('WardModel','idward','idstreet');
    },
    addresses:function(){
        return this.hasMany('AddressModel','street_id','idstreet');
    }
});
var Streets = bookshelf.Collection.extend({
    model:StreetModel,
});
module.exports.StreetModel = bookshelf.model('StreetModel',StreetModel);
module.exports.StreetCollection = bookshelf.collection('StreetCollection',Streets);
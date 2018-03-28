var bookshelf = require('../db/dbconnect').bookshelf;
require('./field_profileModel').Field_ProfileModel;
require('./profileModel').ProfileModel;
var FieldModel = bookshelf.Model.extend({
    tableName:"fields",
    idAttribute:'idfield',
    fields_profiles:function(){
        return this.hasMany('Field_ProfileModel','field_id','idfield');
    },
    profile:function(){
        return this.belongsTo('ProfileModel','idprofile','profile');
    }
});
var Fields = bookshelf.Collection.extend({
    model:FieldModel,
});
module.exports.FieldModel = bookshelf.model('FieldModel',FieldModel);
module.exports.FieldCollection = bookshelf.collection('FieldCollection',Fields);
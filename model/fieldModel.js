var bookshelf = require('../db/dbconnect');
var Field_ProfileModel = require('./field_profileModel').Field_ProfileModel;
var FieldModel = bookshelf.Model.extend({
    tableName:"fields",
    fields_profiles:function(){
        return this.hasMany(Field_ProfileModel,'field_id','idfield');
    }
});
var Fields = bookshelf.Collection.extend({
    model:FieldModel,
});
module.exports.FieldModel = FieldModel;
module.exports.FieldCollection = Fields;
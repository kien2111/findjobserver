var bookshelf = require('../db/dbconnect').bookshelf;
var FieldModel = require('./fieldModel').FieldModel;
var ProfileModel = require('./profileModel').ProfileModel;
var Field_ProfileModel = bookshelf.Model.extend({
    tableName:"field_profile",
    field:function(){
        return this.belongsTo(FieldModel,'idfield','field_id');
    },
    profile:function(){
        return this.belongsTo(ProfileModel,'idprofile','profile_id');
    }
});
var Field_Profiles = bookshelf.Collection.extend({
    model:Field_ProfileModel,
});
module.exports.Field_ProfileModel = Field_ProfileModel;
module.exports.Field_ProfileCollection = Field_Profiles;
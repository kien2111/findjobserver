var bookshelf = require('../db/dbconnect').bookshelf;
var EmployeeModel = require('./employeeModel').EmployeeModel;
var Field_ProfileModel = require('./field_profileModel').Field_ProfileModel;
var Category_ProfileModel = require('./category_profileModel').Category_ProfileModel;
var UserModel = require('./userModel').UserModel;
var Request_Update_Profile = require('./request_update_profileModel').Request_Update_ProfileModel;
var FieldModel = require('./fieldModel').FieldModel;
var CategoryModel = require('./categoryModel').CategoryModel;
var ProfileModel = bookshelf.Model.extend({
    tableName:"profiles",
    idAttribute:"idprofile",
    employee:function(){
        return this.hasOne(EmployeeModel,'idemployee','idprofile');
    },
    fields_profiles:function(){
        return this.hasMany(Field_ProfileModel,'profile_id','idprofile');
    },
    categories_profiles:function(){
        return this.hasMany(Category_ProfileModel,'idprofile','idprofile');
    },
    profile:function(){
        return this.belongsTo(UserModel,'iduser','idprofile');
    },
    request_update_profiles:function(){
        return this.hasMany(Request_Update_ProfileModel,'profile_id','idprofile');
    },
    fields:function(){
        return this.hasMany(FieldModel,'idfield','idprofile');
    },
    category:function(){
        return this.belongsTo(CategoryModel,'idcategory','idprofile');
    }
});
var Profiles = bookshelf.Collection.extend({
    model:ProfileModel,
});
module.exports.ProfileModel = ProfileModel;
module.exports.ProfileCollection = Profiles;
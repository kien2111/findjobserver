var bookshelf = require('../db/dbconnect');
var EmployeeModel = require('./employeeModel').EmployeeModel;
var Field_ProfileModel = require('./field_profileModel').Field_ProfileModel;
var Category_ProfileModel = require('./category_profileModel').Category_ProfileModel
var ProfileModel = bookshelf.Model.extend({
    tableName:"profiles",
    employee:function(){
        return this.belongsTo(EmployeeModel,'idemployee','idprofile');
    },
    fields_profiles:function(){
        return this.hasMany(Field_ProfileModel,'profile_id','idprofile');
    },
    categories_profiles:function(){
        return this.hasMany(Category_ProfileModel,'idprofile','idprofile');
    }
});
var Profiles = bookshelf.Collection.extend({
    model:ProfileModel,
});
module.exports.ProfileModel = ProfileModel;
module.exports.ProfileCollection = Profiles;
var bookshelf = require('../db/dbconnect');
var CategoryModel = require('./categoryModel').CategoryModel;
var ProfileModel = require('./profileModel').ProfileModel;
var Category_ProfileModel = bookshelf.Model.extend({
    tableName:"profile_category",
    profile:function(){
        return this.belongsTo(ProfileModel,'idprofile','idprofile');
    },
    category:function(){
        return this.belongsTo(CategoryModel,'idcategory','idcategory');
    }
});
var Categorys_Profiles = bookshelf.Collection.extend({
    model:Category_ProfileModel,
});
module.exports.Category_ProfileModel = Category_ProfileModel;
module.exports.Category_ProfileCollection = Categorys_Profiles;
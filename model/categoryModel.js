var bookshelf = require('../db/dbconnect');
var Category_ProfileModel = require('./category_profileModel').Category_ProfileCollection;
var CategoryModel = bookshelf.Model.extend({
    tableName:"categories",
    categories_profiles:function(){
        return this.hasMany(Category_ProfileModel,'idcategory','idcategory');
    }
});
var Categories = bookshelf.Collection.extend({
    model:CategoryModel,
});
module.exports.CategoryModel = CategoryModel;
module.exports.CategoryCollection = Categories;
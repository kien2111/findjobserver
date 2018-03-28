var bookshelf = require('../db/dbconnect').bookshelf;
var Category_ProfileModel = require('./category_profileModel').Category_ProfileCollection;
require('./profileModel').ProfileModel;
var CategoryModel = bookshelf.Model.extend({
    tableName:"categories",
    idAttribute:'idcategory',
    categories_profiles:function(){
        return this.hasMany('Category_ProfileModel','idcategory','idcategory');
    },
    profiles:function(){
        return this.hasMany('ProfileModel','category','idcategory');
    }
});
var Categories = bookshelf.Collection.extend({
    model:CategoryModel,
});
module.exports.CategoryModel = bookshelf.model('CategoryModel',CategoryModel);
module.exports.CategoryCollection = bookshelf.collection('CategoryCollection',Categories);
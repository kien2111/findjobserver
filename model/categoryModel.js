var {bookshelf} = require('../db/dbconnect');
var {ProfileModel} = require('./profileModel');
var CategoryModel = bookshelf.Model.extend({
    tableName:"categories",
    idAttribute:'idcategory',
    profiles:function(){
        return this.hasMany('ProfileModel','category','idcategory');
    }
});
var Categories = bookshelf.Collection.extend({
    model:CategoryModel,
});
module.exports.CategoryModel = bookshelf.model('CategoryModel',CategoryModel);
module.exports.CategoryCollection = bookshelf.collection('CategoryCollection',Categories);
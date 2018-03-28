var bookshelf = require('../db/dbconnect').bookshelf;
require('./categoryModel').CategoryModel;
require('./profileModel').ProfileModel;
var Category_ProfileModel = bookshelf.Model.extend({
    tableName:"profile_category",
    profile:function(){
        return this.belongsTo('ProfileModel','idprofile','idprofile');
    },
    category:function(){
        return this.belongsTo('CategoryModel','idcategory','idcategory');
    }
});
var Categorys_Profiles = bookshelf.Collection.extend({
    model:Category_ProfileModel,
});
module.exports.Category_ProfileModel = bookshelf.model('Category_ProfileModel',Category_ProfileModel);
module.exports.Category_ProfileCollection =bookshelf.collection('Category_ProfileCollection',Categorys_Profiles);
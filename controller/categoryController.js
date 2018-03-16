var _ = require('lodash');
var Profile = require('../model/profileModel');
var Category_Profile = require('../model/category_profileModel');
var Category = require('../model/categoryModel');
var uuidv4 = require('uuid/v4');
exports.getAllCategories = function(req,res){
    Category.CategoryCollection.forge().fetch().then(model=>{
        res.status(200).json({message:`get categories success`,data:model});
    }).catch(err=>{
        res.status(500).json({message:`error from database ${err.message}`,data:null});
    });
}
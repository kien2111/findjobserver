var _ = require('lodash');
var {ProfileModel} = require('../model/profileModel');
var {CategoryModel,CategoryCollection} = require('../model/categoryModel');
exports.getAllCategories = function(req,res){
    CategoryCollection.forge().fetch().then(model=>{
        res.status(200).json({message:`get categories success`,data:model});
    }).catch(err=>{
        res.status(500).json({message:`error from database ${err.message}`,data:null});
    });
}
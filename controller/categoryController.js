var _ = require('lodash');
var {ProfileModel} = require('../model/profileModel');
var {CategoryModel,CategoryCollection} = require('../model/categoryModel');
exports.getAllCategories = function(req,res){
    CategoryModel.getAllCategories().then(model=>{
        console.log(model);
        res.status(200).json({message:`get categories success`,data:model});
    })
    .catch(console.log)
    .catch(err=>{
        res.status(500).json({message:`error from database ${err.message}`,data:null});
    });
}
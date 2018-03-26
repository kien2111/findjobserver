var Account = require("../model/accountModel");

exports.getAllUser = function (req,res){
    Account.AccountModel.fetchAll().then(function(model){
        res.status(200).json({message:"fetch OK",data:model.toJSON()});
    }).catch(function(err){
        res.status(404).json({message:`${err}`,data:null});
    });
}

exports.getAllUser1 = function (req,res){
    Account.AccountModel.where('id', 1).fetch({withRelated:['accounts_roles.role']}).then(function(model){
        res.status(200).json({message:"fetch OK",data:model.toJSON()});
    }).catch(function(err){
        res.status(404).json({message:`${err}`,data:null});
    });
}


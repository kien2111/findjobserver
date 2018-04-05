var {UserModel} = require('../model/userModel');
exports.getAllUser = function (req,res){
    UserModel.fetchAll().then(function(model){
        res.status(200).json({message:"fetch OK",data:model.toJSON()});
    }).catch(function(err)
    {
        res.status(404).json({message:`${err}`,data:null});
    });
}

exports.getAllUser1 = function (req,res){
    UserModel.where('id', 1).fetch({withRelated:['accounts_roles.role']}).then(function(model){
        res.status(200).json({message:"fetch OK",data:model.toJSON()});
    }).catch(function(err){
        res.status(404).json({message:`${err}`,data:null});
    });
}

//delete user
exports.deleteUser= function(req,res)
{
    try{
        let json = req.body;
        console.log(json[0].id);
        if(json==null)
        {
            res.status(500).json({message:"no find id",data:null});
        }
        else{
            for(var i in json)
            {
                let result1= Account.AccountModel.forge({id:json[i].id}).destroy().then(result=>{
                if(result)
                {
                    res.status(200).json({message:"delete ok",data:null});
                }
            }).catch(err=>{
                console.log(err);
            })
            }
        }
        }
    catch(error){
    }
}

//insert user
exports.insertuser = function(req,res){
    try{
        let userinsert= req.body;
        if(userinsert==null){
            res.status(200).json({message:"data null",data:null});
        }else{
            Account.AccountModel.forge({
                id:'1',
                username:'ádfasdfasd'
                        })
            .save()
            .then(resuilt=>{
                if(resuilt)
                {
                    res.status(200).json({message:"insert ok",data:null});
                }
            })
        }
    }
    catch(error){
    }
}


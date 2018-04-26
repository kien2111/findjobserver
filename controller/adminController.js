var {UserModel} = require('../model/userModel');
var {RoleModel} = require('../model/account_roleModel');

exports.getAllUser = function (req,res){
    UserModel.fetchAll().then(function(model){
        res.status(200).json({message:"fetch OK",data:model.toJSON()});
    }).catch(function(err)
    {
        res.status(404).json({message:`${err}`,data:null});
    });
}

//get user block
exports.getAllUserBlock = function (req,res){

    console.log(req.body);

    UserModel.getAllBlockedUser(req.body)
    .tap(console.log)
    .then(function(model){
        res.status(200).json({message:"fetch OK",data:model.toJSON()});
    })
    .catch(console.log)
    .catch(function(err){
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
                let result1= UserModel.forge({id:json[i].id}).destroy().then(result=>{
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
exports.insertuser = function(req,res,next){
    try{
        console.log(req.file);
        let userinsert= req.body;
        userinsert.avatar = req.file.filename;
        userinsert.birthday = new Date(req.body.birthday);
        if(!userinsert){
            res.status(200).json({message:"data null",data:null});
        }else{
            UserModel.sigupadmin(userinsert)
            .then(resuilt=>{
                if(resuilt){
                    res.status(200).json({message:"insert ok",data:null});
                    console.log(resuilt);
                }
            })
        } 
    }
    catch(error){
        console.log(error);
    }
}
//update user
exports.updateuser = function(req,res){
    try{
        let userupdate= req.body;
        if(userupdate==null){
            res.status(200).json({message:"data null",data:null});
        }else{
            UserModel.updateadmin(userupdate)
            .tap(console.log)
            .then(resuilt=>{
                if(resuilt)
                {
                    res.status(200).json({message:"update ok",data:null});
                }
            }).catch(console.log)
            .catch(err=>{
                res.status(400).json({message:err.message,data:null});
            })
        }
    }
    catch(error){
    }
}
//block  user
exports.blockuser = function(req,res){
    try{
        let userupdate= req.body;
        if(userupdate==null){
            res.status(200).json({message:"data null",data:null});
        }else{
            UserModel.blockuser(userupdate)
            .then(resuilt=>{
                if(resuilt)
                {
                    res.status(200).json({message:"block ok",data:null});
                }
            }).catch(console.log)
            .catch(err=>{
                res.status(400).json({message:err.message,data:null});
            })
        }
    }
    catch(error){
    }
}

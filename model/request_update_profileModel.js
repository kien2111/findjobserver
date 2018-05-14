var {bookshelf} = require('../db/dbconnect');
var {ProfileModel} = require('./profileModel');
var Promise = require('bluebird');
var _ = require('lodash');
var Request_Update_ProfileModel = bookshelf.Model.extend({
    tableName:"requests_update_profile",
    idAttribute:'idrequest_update_profile',
    hasTimestamps:true,
    profile:function(){
        return this.hasOne('ProfileModel','idprofile','profile_id');
    }
},{
    insertRequest:Promise.method(function(obj){
        return this.forge(obj).save();
    }),
    getLastestProcessRequest:Promise.method(function(iduser){
        return this.forge().query(function(db){
            let date = new Date();
            date.setFullYear( date.getFullYear() - 1 );
            db.where('created_at','>=',date);
            db.where('approve','=',Approve_Upgrade_Profile.ON_PROGRESS);
            db.where({profile_id:iduser});
            db.debug();
        })
        .orderBy('-created_at')
        .fetch({require:true});
    }),
    deleteLastestUpgradeRequest:Promise.method(function(profile_id){
        return this.forge({approve:Approve_Upgrade_Profile.DECLINE})
            .where({profile_id:profile_id,approve:Approve_Upgrade_Profile.ON_PROGRESS})
            .save(null,{method:"update"});
    }),
});
var Request_Update_ProfileModels = bookshelf.Collection.extend({
    model:Request_Update_ProfileModel,
});
var Approve_Upgrade_Profile = {
    NORMAL:1,
    ON_PROGRESS:2,
    ACTIVE:3,
    DECLINE:5
}
module.exports.Request_Update_ProfileModel = bookshelf.model('Request_Update_ProfileModel',Request_Update_ProfileModel);
module.exports.Request_Update_ProfileCollection = bookshelf.collection('Request_Update_ProfileCollection',Request_Update_ProfileModels);
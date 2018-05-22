var {bookshelf} = require('../db/dbconnect');
var {ProfileModel} = require('./profileModel');
var Approve_Upgrade_Profile = {
    NORMAL:1,
    ON_PROGRESS:2,
    ACTIVE:3,
    DECLINE:5
}
var Promise = require('bluebird');

var Request_Update_ProfileModel = bookshelf.Model.extend({
    tableName:"requests_update_profile",
    idAttribute:'idrequest_update_profile',
    profile:function(){
        return this.hasOne('ProfileModel','idprofile','profile_id');
    }
},{
    getAllUpgradeAccount:Promise.method(function(){
        return this.forge().where({approve:Approve_Upgrade_Profile.ON_PROGRESS})
                .fetchAll({withRelated:['profile']});
    }),
    // getAllUpgradeAccount:Promise.method(function(query){
    //     return this.forge().where('approve','=',Approve_Upgrade_Profile.ON_PROGRESS)}
    //     .fetchAll({withRelated:['requests_update_profile.profile_id','users.iduser']})
});
var Request_Update_ProfileModels = bookshelf.Collection.extend({
    model:Request_Update_ProfileModel
});
module.exports.Request_Update_ProfileModel = bookshelf.model('Request_Update_ProfileModel',Request_Update_ProfileModel);
module.exports.Request_Update_ProfileCollection = bookshelf.collection('Request_Update_ProfileCollection',Request_Update_ProfileModels);
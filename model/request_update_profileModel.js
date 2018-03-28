var bookshelf = require('../db/dbconnect').bookshelf;
var ProfileModel = require('./profileModel').ProfileModel;
var Request_Update_ProfileModel = bookshelf.Model.extend({
    tableName:"request_update_profile",
    idAttribute:'idrequest_update_profile',
    accounts_roles:function(){
        return this.hasMany('Account_RoleModel','idrole','idrole');
    },
    profile:function(){
        return this.hasOne('ProfileModel','idprofile','profile_id');
    }
});
var Request_Update_ProfileModels = bookshelf.Collection.extend({
    model:Request_Update_ProfileModel,
});
module.exports.Request_Update_ProfileModel = bookshelf.model('Request_Update_ProfileModel',Request_Update_ProfileModel);
module.exports.Request_Update_ProfileCollection = bookshelf.collection('Request_Update_ProfileCollection',Request_Update_ProfileModels);
var {bookshelf} = require('../db/dbconnect');
var {UserModel} = require('./userModel');
var _ = require('lodash');
var {enumTransaction,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var Promise = require('bluebird');
var {Request_Update_ProfileModel} = require('./request_update_profileModel');
var Pakage_UpdateModel = bookshelf.Model.extend({
    tableName:"pakage_update",
    idAttribute:'idpakage_update',
    request_update_profile:function(){
        return this.hasMany('Request_Update_ProfileModel','idpakage','idpakage_update');
    }
},{
    getListPakageUpgrade:Promise.method(function(){
        return this.forge().fetchAll();
    })
});
var Pakage_Updates = bookshelf.Collection.extend({
    model:Pakage_UpdateModel,
});
module.exports.Pakage_UpdateModel = bookshelf.model('Pakage_UpdateModel',Pakage_UpdateModel);
module.exports.Pakage_UpdateCollection = bookshelf.collection('Pakage_UpdateCollection',Pakage_Updates);
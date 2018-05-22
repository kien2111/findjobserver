var {bookshelf} = require('../db/dbconnect');
var {enumTransaction,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var {Account_RoleModel} = require('./account_roleModel');
var RoleModel = bookshelf.Model.extend({
    tableName:"roles",
    idAttribute:'idrole',
    accounts_roles:function(){
        return this.hasMany('Account_RoleModel','idrole','idrole');
    }
});
var Roles = bookshelf.Collection.extend({
    model:RoleModel,
});
module.exports.RoleModel = bookshelf.model('RoleModel',RoleModel);
module.exports.RoleCollection = bookshelf.collection('RoleCollection',Roles);
var {RoleModel} = require('./roleModel');
var {bookshelf} = require('../db/dbconnect');
var {enumTransation,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var Account_RoleModel = bookshelf.Model.extend({
    tableName:"accounts_roles",
    user:function(){
        return this.belongsTo('UserModel','iduser','iduser');
    },
    role:function(){
        return this.belongsTo('RoleModel','idrole','idrole');
    }
});
var Account_RoleModels = bookshelf.Collection.extend({
    model:Account_RoleModel,
});
module.exports.Account_RoleModel =bookshelf.model('Account_RoleModel',Account_RoleModel);
module.exports.Account_RoleModelCollection = bookshelf.collection('Account_RoleModelCollection',Account_RoleModels);
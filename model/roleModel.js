var bookshelf = require('../db/dbconnect');
var Account_RoleModel = require('./account_roleModel');
var RoleModel = bookshelf.Model.extend({
    tableName:"roles",
    accounts_roles:function(){
        return this.hasMany(Account_RoleModel,'idrole','idrole');
    }
});
var Roles = bookshelf.Collection.extend({
    model:RoleModel,
});
module.exports.RoleModel = RoleModel;
module.exports.RoleCollection = Roles;
var AccountModel = require('./accountModel').AccountModel;
var RoleModel = require('./roleModel').RoleModel;
var bookshelf = require('../db/dbconnect').bookshelf;
var Account_RoleModel = bookshelf.Model.extend({
    tableName:"accounts_roles",
    account:function(){
        return this.belongsTo(AccountModel,'id','idaccount');
    },
    role:function(){
        return this.belongsTo(RoleModel,'idrole','idrole');
    }
});
var Account_RoleModels = bookshelf.Collection.extend({
    model:Account_RoleModel,
});
module.exports.Account_RoleModel = Account_RoleModel;
module.exports.Account_RoleModelCollection = Account_RoleModels;
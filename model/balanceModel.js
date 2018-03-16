var bookshelf = require('../db/dbconnect');
var AccountModel = require('./accountModel').AccountModel;
var BalanceModel = bookshelf.Model.extend({
    tableName:"balances",
    hasTimestamps:true,
    account:function(){
        return this.belongsTo(AccountModel,'id','idbalance');
    }
});
var Balances = bookshelf.Collection.extend({
    model:BalanceModel,
});
module.exports.BalanceModel = BalanceModel;
module.exports.BalanceCollection = Balances;
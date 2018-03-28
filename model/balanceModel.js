var bookshelf = require('../db/dbconnect').bookshelf;
require('./accountModel').AccountModel;
var BalanceModel = bookshelf.Model.extend({
    tableName:"balances",
    idAttribute:'idbalance',
    hasTimestamps:true,
    account:function(){
        return this.belongsTo('AccountModel','id','idbalance');
    }
});
var Balances = bookshelf.Collection.extend({
    model:BalanceModel,
});
module.exports.BalanceModel = bookshelf.model('BalanceModel',BalanceModel);
module.exports.BalanceCollection = bookshelf.collection('BalanceCollection',Balances);
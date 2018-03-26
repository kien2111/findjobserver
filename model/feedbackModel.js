var bookshelf = require('../db/dbconnect').bookshelf;
var AccountModel = require('./accountModel').AccountModel;
var FeedBackModel = bookshelf.Model.extend({
    tableName:"feedbacks",
    idAttribute:'id',
    account:function(){
        return this.belongsTo(AccountModel,'id','account_id');
    }
});
var FeedBacks = bookshelf.Collection.extend({
    model:FeedBackModel,
});
module.exports.FeedBackModel = FeedBackModel;
module.exports.EventCollection = FeedBacks;
var bookshelf = require('../db/dbconnect').bookshelf;
require('./accountModel').AccountModel;
var NotificationModel = bookshelf.Model.extend({
    tableName:"notifications",
    idAttribute:'idnotification',
    hasTimestamps:true,
    account:function(){
        return this.hasMany('AccountModel','id','account_id');
    }
});
var Notifications = bookshelf.Collection.extend({
    model:NotificationModel,
});
module.exports.NotificationModel = bookshelf.model('NotificationModel',NotificationModel);
module.exports.NotificationCollection = bookshelf.collection('NotificationCollection',Notifications);
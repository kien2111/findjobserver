var bookshelf = require('../db/dbconnect').bookshelf;
var Promote_EventModel = require('./promote_eventModel').Promote_EventModel;
var PromoteModel = bookshelf.Model.extend({
    tableName:"promotes",
    promote:function(){
        return this.hasMany(Promote_EventModel,'idpromote','idpromote');
    }
});
var Promotes = bookshelf.Collection.extend({
    model:PromoteModel,
});
module.exports.PromoteModel = PromoteModel;
module.exports.PromoteCollection = Promotes;
var bookshelf = require('../db/dbconnect').bookshelf;
var PromoteModel = require('./promoteModel').PromoteModel;
var EventModel = require('./eventModel').EventModel;
var Promote_EventModel = bookshelf.Model.extend({
    tableName:"promote_event",
    event:function(){
        return this.belongsTo(EventModel,'idevent','idevent');
    },
    promote:function(){
        return this.belongsTo(PromoteModel,'idpromote','idpromote');
    }
});
var Promote_EventModels = bookshelf.Collection.extend({
    model:Promote_EventModel,
});
module.exports.Promote_EventModel = Promote_EventModel;
module.exports.Promote_EventCollection = Promote_EventModels;
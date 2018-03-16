var bookshelf = require('../db/dbconnect');
var Promote_EventModel = require('./promote_eventModel').Promote_EventModel;
var EventModel = bookshelf.Model.extend({
    tableName:"events",
    promote_event:function(){
        return this.hasMany(Promote_EventModel,'idevent','idevent');
    }
});
var Events = bookshelf.Collection.extend({
    model:EventModel,
});
module.exports.EventModel = EventModel;
module.exports.EventCollection = Events;
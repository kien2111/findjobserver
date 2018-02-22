var bookshelf = require('../db/dbconnect');
module.exports.Event = bookshelf.Model.extend({
    tableName:"events",
});